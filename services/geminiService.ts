
import { GoogleGenAI, Type } from "@google/genai";
import { ParticleConfig, DEFAULT_CONFIG } from "../types";
import { TEXTURE_MAP, SVG_FLARE, NOISE_PRESETS } from "../assets";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper: Compress config for AI (remove huge base64 strings)
// Returns a simplified config suitable for the AI prompt
const compressConfig = (config: ParticleConfig): { simplified: any, originalTextureUrl: string, placeholderKey: string } => {
    const copy: any = { ...config };
    const originalTextureUrl = config.textureUrl;
    
    // Check if texture matches a known preset
    let placeholderKey = "CUSTOM";
    
    // Find key by value in TEXTURE_MAP
    const foundKey = Object.entries(TEXTURE_MAP).find(([key, url]) => url === originalTextureUrl);
    
    if (foundKey) {
        placeholderKey = foundKey[0];
    }
    
    // REMOVE textureUrl entirely from the object sent to AI
    delete copy.textureUrl;
    // ADD textureID
    copy.textureID = placeholderKey;

    // Handle Noise
    if (copy.noiseTextureUrl) {
         const noiseName = NOISE_PRESETS.find(p => p.url === copy.noiseTextureUrl)?.name || "CUSTOM";
         copy.noiseTextureID = noiseName;
         delete copy.noiseTextureUrl;
    }
    
    return { simplified: copy, originalTextureUrl, placeholderKey };
};

// Robust JSON extraction with Sanitization
function extractJSON(text: string): any {
    let jsonText = text.trim();
    
    // 1. Strip Markdown Code Blocks
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim();
    }
    
    // 2. Find limits of JSON object
    const start = jsonText.indexOf('{');
    const end = jsonText.lastIndexOf('}');
    
    if (start === -1 || end === -1) {
        throw new Error("No JSON object found in response");
    }
    
    jsonText = jsonText.substring(start, end + 1);

    // 3. Pre-sanitize forbidden fields (robustly)
    // Replace textureUrl lines entirely to avoid escape issues if AI hallucinated them back in
    jsonText = jsonText.replace(/"textureUrl"\s*:[\s\S]*?(,|}|\n)/g, (match, endChar) => {
        return `"textureUrl": "REMOVED"${endChar}`;
    });

    // ATTEMPT 1: Standard Parse
    try {
      return JSON.parse(jsonText);
    } catch (e) {
      console.warn("Initial JSON Parse Failed. Attempting repairs...", e);
      
      // RECOVERY STRATEGY 1: Aggressive customSVG removal (Targeting the specific known failure point)
      // Since customSVG is usually the culprit for broken JSON due to unescaped quotes in XML.
      try {
          // Look for the key
          const keyIndex = jsonText.indexOf('"customSVG"');
          if (keyIndex !== -1) {
              // Find the comma before it (to remove trailing comma for previous property)
              let cutStart = keyIndex;
              let tempIndex = keyIndex - 1;
              
              // Walk backwards to find the comma
              while (tempIndex > 0) {
                  const char = jsonText[tempIndex];
                  if (char === ',') {
                      cutStart = tempIndex;
                      break;
                  }
                  if (!/\s/.test(char)) {
                      // Found non-whitespace before comma, implies structure is weird or comma missing
                      // Just cut from key to be safe
                      break; 
                  }
                  tempIndex--;
              }

              // Reconstruct JSON without the customSVG part
              // We just close the object immediately after the previous property.
              // Note: This assumes customSVG is at the end as requested in system instructions.
              const before = jsonText.substring(0, cutStart);
              const patched = before + "\n}"; // Close object
              
              console.log("Attempting to parse patched JSON (removed customSVG)...");
              return JSON.parse(patched);
          }
      } catch (e2) {
          console.warn("Patched JSON parse failed.", e2);
      }

      // RECOVERY STRATEGY 2: Remove Newlines in strings (Common LLM error)
      try {
          const noNewLines = jsonText.replace(/[\r\n]+/g, " ");
          return JSON.parse(noNewLines);
      } catch (e3) {
          console.error("JSON Parse Critical Failure. Snippet:", jsonText.substring(0, 100) + "...");
          throw e;
      }
    }
  }

export const generateParticleConfigFromPrompt = async (
  prompt: string,
  baseConfig?: ParticleConfig,
  forceNewShape: boolean = false
): Promise<ParticleConfig> => {
  try {
    let contents = `Generate a Babylon.js particle system configuration for: "${prompt}"`;
    let originalTextureUrl = "";
    let placeholderKey = "FLARE";
    let simplifiedConfig = null;

    if (baseConfig) {
        const compressed = compressConfig(baseConfig);
        originalTextureUrl = compressed.originalTextureUrl;
        placeholderKey = compressed.placeholderKey;
        simplifiedConfig = compressed.simplified;

        contents = `
        You are modifying an existing Babylon.js particle system.

        Existing Configuration:
        ${JSON.stringify(simplifiedConfig)}

        User Request for Modification:
        "${prompt}"
        
        Return the fully updated JSON configuration.
        `;
    }

    const validTextureKeys = [...Object.keys(TEXTURE_MAP), "GENERATED", "CUSTOM"];
    const validNoiseKeys = NOISE_PRESETS.map(n => n.name).filter(n => n !== 'None');

    let shapeInstruction = `
        TEXTURE LOGIC:
        - If the user asks for a specific shape NOT in the list below (e.g., "lightning", "leaf", "sword", "diamond"), set textureID to 'GENERATED'.
        - If textureID is 'GENERATED', you MUST provide a valid, simple SVG XML string in 'customSVG'.
        - JSON SAFETY: Inside the 'customSVG' string, YOU MUST USE SINGLE QUOTES (') for all XML attributes. Do not use double quotes inside the string value.
    `;

    if (forceNewShape) {
        shapeInstruction = `
        CRITICAL SHAPE INSTRUCTION:
        The user explicitly requested a NEW GENERATED SHAPE.
        1. You MUST set textureID to 'GENERATED'.
        2. You MUST create a new 'customSVG' string that visually matches the user's prompt (e.g. "${prompt}").
        3. The SVG must be white fill on transparent background.
        4. JSON SAFETY: Inside the 'customSVG' string, YOU MUST USE SINGLE QUOTES (') for all XML attributes. Do not use double quotes inside the string value.
        `;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", 
      contents: contents,
      config: {
        maxOutputTokens: 8192, 
        systemInstruction: `You are an expert in Babylon.js particle systems for RPG Maker MZ.
        Generate a JSON configuration based on the user's description.
        
        Rules:
        1.  Return ONLY the JSON object.
        2.  For colors, use Hex codes.
        3.  CRITICAL: DO NOT OUTPUT 'textureUrl'. Use 'textureID'.
        4.  ORDERING: Place 'customSVG' as the LAST property of the JSON object.
        
        ${shapeInstruction}
        
        TEXTURE ID LIST:
        - FLARE, FLAME, GLOW, STAR, TRIANGLE, HEART, SKULL, HUMAN, GODRAYS
        - LOOP, SPIRAL, CLOUD, SMOKE, QUESTION, EXCLAMATION, MIX, SUN, MOON, ZZZ
        - CUSTOM (Preserve existing custom texture)
        - GENERATED (Create new SVG in customSVG field)

        NOISE & TURBULENCE:
        - Use 'noiseTextureID' if the effect needs smoke, fire, plasma, or chaotic movement.
        - Valid Noise IDs: 'Standard Noise', 'Perlin Cloud', 'Ripple'.
        - If using noise, set 'noiseStrength' (e.g. {x:10, y:10, z:10}).

        ADVANCED GRADIENTS:
        - Use 'useRampGradients: true' and 'rampGradients' array if the prompt asks for "Rainbow", "Multi-color", or complex color shifts (e.g. Yellow -> Orange -> Red -> Black).
        - 'rampGradients' items: { gradient: 0-1, color: "#HEX", opacity: 0-1 }

        VISIBILITY SAFETY:
        - If 'useRampGradients' is false, ensure 'startAlpha' and 'endAlpha' are not both 0.
        `,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            capacity: { type: Type.NUMBER },
            emitRate: { type: Type.NUMBER },
            minLifeTime: { type: Type.NUMBER },
            maxLifeTime: { type: Type.NUMBER },
            minSize: { type: Type.NUMBER },
            maxSize: { type: Type.NUMBER },
            minEmitPower: { type: Type.NUMBER },
            maxEmitPower: { type: Type.NUMBER },
            updateSpeed: { type: Type.NUMBER },
            gravity: {
              type: Type.OBJECT,
              properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER }, z: { type: Type.NUMBER } },
              required: ["x", "y", "z"],
            },
            color1: { type: Type.STRING },
            color2: { type: Type.STRING },
            colorDead: { type: Type.STRING },
            startAlpha: { type: Type.NUMBER },
            endAlpha: { type: Type.NUMBER },
            colorMidPoint: { type: Type.NUMBER },
            
            // Advanced Gradients
            useRampGradients: { type: Type.BOOLEAN },
            rampGradients: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        gradient: { type: Type.NUMBER },
                        color: { type: Type.STRING },
                        opacity: { type: Type.NUMBER }
                    },
                    required: ["gradient", "color", "opacity"]
                }
            },

            // Noise
            noiseTextureID: { type: Type.STRING, enum: validNoiseKeys },
            noiseStrength: {
                type: Type.OBJECT,
                properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER }, z: { type: Type.NUMBER } },
                required: ["x", "y", "z"]
            },

            direction1: {
              type: Type.OBJECT,
              properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER }, z: { type: Type.NUMBER } },
              required: ["x", "y", "z"],
            },
            direction2: {
              type: Type.OBJECT,
              properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER }, z: { type: Type.NUMBER } },
              required: ["x", "y", "z"],
            },
            minEmitBox: {
              type: Type.OBJECT,
              properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER }, z: { type: Type.NUMBER } },
              required: ["x", "y", "z"],
            },
            maxEmitBox: {
              type: Type.OBJECT,
              properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER }, z: { type: Type.NUMBER } },
              required: ["x", "y", "z"],
            },
            textureID: { type: Type.STRING, enum: validTextureKeys },
            blendMode: { type: Type.STRING, enum: ["ONEONE", "STANDARD"] },
            preWarmCycles: { type: Type.NUMBER },
            customSVG: {
                type: Type.STRING,
                description: "Single-line SVG XML string (64x64) if textureID is GENERATED. Attributes must use single quotes. Place this field LAST."
            },
          },
          required: [
            "name", "capacity", "emitRate", "minLifeTime", "maxLifeTime",
            "minSize", "maxSize", "minEmitPower", "maxEmitPower", "updateSpeed",
            "gravity", "color1", "color2", "colorDead", "direction1",
            "direction2", "minEmitBox", "maxEmitBox", "textureID", "blendMode",
            "preWarmCycles"
          ],
        },
      },
    });

    // Fix TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
    const textResponse = response.text || "{}";
    const parsed = extractJSON(textResponse);
    
    // Map textureID back to textureUrl
    const upperKey = parsed.textureID ? parsed.textureID.toUpperCase() : "FLARE";
    delete parsed.textureID;

    // Map Noise ID
    if (parsed.noiseTextureID) {
        const found = NOISE_PRESETS.find(n => n.name === parsed.noiseTextureID);
        if (found && found.url) {
            parsed.noiseTextureUrl = found.url;
        }
        delete parsed.noiseTextureID;
    }
    
    const resultConfig = parsed as ParticleConfig;

    // --- VISIBILITY SAFETY NET ---
    if (!resultConfig.useRampGradients) {
        const sA = resultConfig.startAlpha ?? 1;
        const eA = resultConfig.endAlpha ?? 0;
        if (sA <= 0.05 && eA <= 0.05) {
            console.warn("AI generated invisible particles. Enforcing visibility.");
            resultConfig.startAlpha = 1.0;
            resultConfig.endAlpha = 0.0;
        }
    }

    if (upperKey === "GENERATED" && parsed.customSVG) {
        try {
            const svgEncoded = btoa(unescape(encodeURIComponent(parsed.customSVG)));
            resultConfig.textureUrl = `data:image/svg+xml;base64,${svgEncoded}`;
        } catch (e) {
            console.error("Failed to encode generated SVG", e);
            resultConfig.textureUrl = SVG_FLARE;
        }
        delete parsed.customSVG; 
    } else if (TEXTURE_MAP[upperKey]) {
        resultConfig.textureUrl = TEXTURE_MAP[upperKey];
    } else if (baseConfig && (upperKey === "CUSTOM" || upperKey === placeholderKey)) {
        resultConfig.textureUrl = originalTextureUrl;
    } else {
        resultConfig.textureUrl = SVG_FLARE;
    }
    
    return resultConfig;

  } catch (error) {
    console.error("Failed to generate particle config", error);
    return baseConfig ? { ...baseConfig } : { ...DEFAULT_CONFIG, name: "ErrorFallback" };
  }
};
