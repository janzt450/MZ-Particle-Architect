export const DOCS_HTML = `<!-- 
  =============================================================================
  !!! MAINTENANCE FLAG: READ BEFORE EDITING !!!
  
  DO NOT UPDATE, MODIFY, OR READ THIS FILE INTO CONTEXT FOR GENERAL QUERIES.
  
  THIS FILE IS ON A SEMI-ANNUAL UPDATE CYCLE. 
  ONLY MODIFY THIS FILE IF THE USER EXPLICITLY REQUESTS A "DOCUMENTATION UPDATE".
  
  PRESERVE THIS HEADER AT ALL COSTS.
  =============================================================================
-->
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MZ Babylon Particle Architect - Documentation</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace'],
                    }
                }
            }
        }
    </script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        h1, h2, h3 { letter-spacing: -0.025em; }
        
        /* Smooth Scrolling */
        html { scroll-behavior: smooth; }

        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d4d4d8; border-radius: 4px; }
        html.dark ::-webkit-scrollbar-thumb { background: #3f3f46; }
        ::-webkit-scrollbar-thumb:hover { background: #a1a1aa; }
        html.dark ::-webkit-scrollbar-thumb:hover { background: #52525b; }
        
        .code-block {
            background-color: #18181b;
            color: #e4e4e7;
            padding: 1rem;
            border-radius: 0.5rem;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.875rem;
            overflow-x: auto;
            border: 1px solid #27272a;
        }

        .note {
            background-color: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 1rem;
            color: #1e40af;
            font-size: 0.95rem;
            border-radius: 0 0.375rem 0.375rem 0;
        }
        html.dark .note {
            background-color: #1e3a8a30;
            color: #93c5fd;
            border-left-color: #3b82f6;
        }

        .warn {
            background-color: #fff7ed;
            border-left: 4px solid #f97316;
            padding: 1rem;
            color: #9a3412;
            font-size: 0.95rem;
            border-radius: 0 0.375rem 0.375rem 0;
        }
        html.dark .warn {
             background-color: #7c2d1230;
             color: #fdba74;
             border-left-color: #f97316;
        }
    </style>
</head>
<body class="bg-zinc-50 text-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 antialiased leading-relaxed transition-colors duration-200">

    <!-- NAVIGATION -->
    <nav class="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-200">
        <div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <!-- MINI ICON SVG -->
                <svg width="24" height="24" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" class="shrink-0 shadow-sm rounded-md">
                   <rect width="512" height="512" rx="100" fill="url(#mini_grad)"/>
                   <rect x="20" y="20" width="472" height="472" rx="80" stroke="white" stroke-opacity="0.3" stroke-width="20"/>
                   <defs>
                       <linearGradient id="mini_grad" x1="0" y1="0" x2="0" y2="512" gradientUnits="userSpaceOnUse">
                           <stop offset="0" stop-color="#60A5FA"/>
                           <stop offset="1" stop-color="#1E40AF"/>
                       </linearGradient>
                   </defs>
                   <circle cx="256" cy="256" r="100" fill="white" fill-opacity="0.2"/>
                </svg>
                <span class="font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">MZ Particle Architect</span>
            </div>
            
            <div class="flex items-center gap-6">
                <div class="hidden md:flex gap-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    <a href="#quickstart" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Quick Start</a>
                    <a href="#workflow" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Workflow</a>
                    <a href="#commands" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Commands</a>
                    <a href="#troubleshooting" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Troubleshooting</a>
                </div>
                
                <!-- Theme Toggle -->
                <button id="theme-toggle" class="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors" title="Toggle Theme">
                    <!-- Sun Icon -->
                    <svg class="hidden dark:block w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    <!-- Moon Icon -->
                    <svg class="block dark:hidden w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                </button>
            </div>
        </div>
    </nav>

    <!-- HERO SECTION -->
    <header class="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 pt-16 pb-20 transition-colors duration-200">
        <div class="max-w-4xl mx-auto px-6 text-center">
            
            <!-- MAIN ICON SVG (RECREATED GLOSSY STYLE) -->
            <div class="w-40 h-40 mx-auto mb-8 shadow-2xl rounded-[2.5rem] transform hover:scale-105 transition-transform duration-300">
                <svg width="100%" height="100%" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <!-- Frame Gradient -->
                        <linearGradient id="frame_grad" x1="256" y1="0" x2="256" y2="512" gradientUnits="userSpaceOnUse">
                           <stop offset="0" stop-color="#8ccdfc"/> <!-- Light Blue Top Highlight -->
                           <stop offset="0.1" stop-color="#4f9ef5"/>
                           <stop offset="0.8" stop-color="#1d4ed8"/>
                           <stop offset="1" stop-color="#1e3a8a"/> <!-- Dark Blue Bottom -->
                        </linearGradient>
                        
                        <!-- Inner Screen Background -->
                        <radialGradient id="screen_bg" cx="50%" cy="0%" r="100%">
                            <stop offset="0" stop-color="#52525b"/>
                            <stop offset="1" stop-color="#18181b"/>
                        </radialGradient>

                        <!-- Spheres (Particles) -->
                        <radialGradient id="sphere_blue" cx="35%" cy="35%" r="60%">
                            <stop offset="0%" stop-color="#dbeafe"/>
                            <stop offset="40%" stop-color="#3b82f6"/>
                            <stop offset="100%" stop-color="#1e3a8a"/>
                        </radialGradient>
                        <radialGradient id="sphere_orange" cx="35%" cy="35%" r="60%">
                            <stop offset="0%" stop-color="#ffedd5"/>
                            <stop offset="40%" stop-color="#f97316"/>
                            <stop offset="100%" stop-color="#9a3412"/>
                        </radialGradient>
                        <radialGradient id="sphere_yellow" cx="35%" cy="35%" r="60%">
                            <stop offset="0%" stop-color="#fef9c3"/>
                            <stop offset="40%" stop-color="#eab308"/>
                            <stop offset="100%" stop-color="#854d0e"/>
                        </radialGradient>
                        <radialGradient id="sphere_cyan" cx="35%" cy="35%" r="60%">
                            <stop offset="0%" stop-color="#cffafe"/>
                            <stop offset="40%" stop-color="#06b6d4"/>
                            <stop offset="100%" stop-color="#164e63"/>
                        </radialGradient>
                        
                        <!-- Glow Filter -->
                         <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                  
                    <!-- Main Body with Bevel -->
                    <rect x="0" y="0" width="512" height="512" rx="100" fill="url(#frame_grad)"/>
                    <!-- Inner Stroke/Bevel simulation -->
                    <rect x="16" y="16" width="480" height="480" rx="90" stroke="black" stroke-opacity="0.2" stroke-width="4" fill="none"/>
                    <rect x="12" y="12" width="488" height="488" rx="92" stroke="white" stroke-opacity="0.3" stroke-width="2" fill="none"/>
                  
                    <!-- Dark Inner Screen -->
                    <rect x="32" y="32" width="448" height="448" rx="80" fill="url(#screen_bg)" stroke="#000" stroke-width="2"/>
                  
                    <!-- Glossy Reflection Top -->
                    <path d="M 32 200 Q 256 260 480 200 L 480 112 A 80 80 0 0 0 400 32 L 112 32 A 80 80 0 0 0 32 112 Z" fill="white" fill-opacity="0.08"/>
                    
                    <!-- 3D GRID FLOOR -->
                    <g transform="translate(0, 40)" opacity="0.6">
                        <path d="M 106 320 L 406 320 L 466 400 L 46 400 Z" fill="none" stroke="white" stroke-opacity="0.3" stroke-width="2"/>
                        <!-- Verticals -->
                        <line x1="256" y1="320" x2="256" y2="400" stroke="white" stroke-opacity="0.2" stroke-width="2"/>
                        <line x1="181" y1="320" x2="151" y2="400" stroke="white" stroke-opacity="0.2" stroke-width="2"/>
                        <line x1="331" y1="320" x2="361" y2="400" stroke="white" stroke-opacity="0.2" stroke-width="2"/>
                        <!-- Horizontals -->
                        <line x1="86" y1="346" x2="426" y2="346" stroke="white" stroke-opacity="0.2" stroke-width="2"/>
                        <line x1="66" y1="373" x2="446" y2="373" stroke="white" stroke-opacity="0.2" stroke-width="2"/>
                    </g>
                
                    <!-- AXES ARROWS -->
                    <!-- Z (Up) -->
                    <line x1="256" y1="360" x2="256" y2="180" stroke="#3b82f6" stroke-width="14" stroke-linecap="round"/>
                    <polygon points="256,150 230,190 282,190" fill="#3b82f6"/>
                    <text x="265" y="180" fill="#60a5fa" font-family="monospace" font-weight="bold" font-size="32">Z</text>
                    
                    <!-- X (Red Left) -->
                    <line x1="256" y1="360" x2="120" y2="420" stroke="#ef4444" stroke-width="14" stroke-linecap="round"/>
                    <text x="90" y="440" fill="#f87171" font-family="monospace" font-weight="bold" font-size="32">X</text>
                    
                    <!-- Y (Green Right) -->
                    <line x1="256" y1="360" x2="392" y2="420" stroke="#22c55e" stroke-width="14" stroke-linecap="round"/>
                    <text x="400" y="440" fill="#4ade80" font-family="monospace" font-weight="bold" font-size="32">Y</text>
                    
                    <!-- PARTICLES (Spheres) -->
                    <!-- Back Layer -->
                    <circle cx="280" cy="280" r="18" fill="url(#sphere_blue)" opacity="0.8"/>
                    <circle cx="230" cy="290" r="14" fill="url(#sphere_cyan)" opacity="0.7"/>
                    
                    <!-- Mid Layer -->
                    <circle cx="260" cy="240" r="28" fill="url(#sphere_yellow)" filter="url(#glow)"/>
                    <circle cx="310" cy="230" r="22" fill="url(#sphere_orange)" filter="url(#glow)"/>
                    <circle cx="200" cy="250" r="20" fill="url(#sphere_blue)" opacity="0.9"/>
                    
                    <!-- Front Layer -->
                    <circle cx="245" cy="170" r="32" fill="url(#sphere_blue)" filter="url(#glow)"/>
                    <circle cx="290" cy="140" r="20" fill="url(#sphere_cyan)" filter="url(#glow)"/>
                    <circle cx="210" cy="200" r="16" fill="url(#sphere_orange)"/>

                    <!-- Specular overlay for glass screen effect -->
                    <path d="M 32 32 L 480 32 A 80 80 0 0 1 480 120 Q 256 180 32 120 A 80 80 0 0 1 32 32 Z" fill="white" fill-opacity="0.1" pointer-events="none"/>
                </svg>
            </div>

            <h1 class="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">MZ Babylon Particle Architect</h1>
            <p class="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                A visual design tool powered by Gemini AI to generate high-performance Babylon.js particle effects for RPG Maker MZ/MV3D.
            </p>
        </div>
    </header>

    <main class="max-w-4xl mx-auto px-6 py-12 space-y-16">

        <!-- INSTALLATION -->
        <section id="quickstart">
            <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                <span class="w-8 h-8 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm border border-indigo-200 dark:border-indigo-800">1</span>
                Quick Start & Installation
            </h2>
            
            <div class="prose prose-zinc dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400">
                <p>To use the effects generated by this tool, you need to install the Core Plugin into your RPG Maker project.</p>
                
                <ol class="list-decimal pl-5 space-y-4 mt-4">
                    <li>
                        <strong>Download the Core Plugin:</strong>
                        <br>In the app's right-hand panel, click the <span class="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-800 dark:text-zinc-200 font-mono text-xs border border-zinc-300 dark:border-zinc-700">CORE PLUGIN</span> button.
                        <br>Save <code>BabylonParticle_Core.js</code> to your project's <code>js/plugins/</code> folder.
                    </li>
                    <li>
                        <strong>Create Data Folder:</strong>
                        <br>Navigate to your project folder: <code>data/</code>.
                        <br>Create a new folder named <code>particles</code>.
                        <br>Result: <code>YourProject/data/particles/</code>.
                    </li>
                    <li>
                        <strong>Enable Plugin:</strong>
                        <br>Open RPG Maker MZ Plugin Manager.
                        <br>Turn ON <code>BabylonParticle_Core</code>.
                    </li>
                </ol>
            </div>
        </section>

        <!-- WORKFLOW -->
        <section id="workflow">
            <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                <span class="w-8 h-8 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm border border-indigo-200 dark:border-indigo-800">2</span>
                Design Workflow
            </h2>

            <div class="grid md:grid-cols-2 gap-8">
                <div class="space-y-4">
                    <h3 class="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <svg class="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        AI Wizard (Gemini)
                    </h3>
                    <p class="text-zinc-600 dark:text-zinc-400 text-sm">
                        Use natural language to describe what you want.
                        <br><br>
                        <em>"A swirling vortex of purple fire."</em><br>
                        <em>"Gentle falling snow that fades out."</em>
                    </p>
                    <div class="note">
                        <strong>Pro Tip:</strong> Check "Force New Shape" to have the AI draw a unique SVG icon for your particle (e.g., a sword, a leaf, a rune) instead of using standard textures.
                    </div>
                </div>

                <div class="space-y-4">
                    <h3 class="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <svg class="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                        Manual Controls
                    </h3>
                    <p class="text-zinc-600 dark:text-zinc-400 text-sm">
                        Fine-tune every aspect of the system.
                    </p>
                    <ul class="list-disc pl-5 text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                        <li><strong>Emitter:</strong> Point, Box, or Floor shapes.</li>
                        <li><strong>Flow:</strong> Omni, Up, Down, or Jet streams.</li>
                        <li><strong>Color:</strong> Simple gradients or Advanced Multi-stop Ramps.</li>
                        <li><strong>Turbulence:</strong> Add noise to simulate smoke/wind.</li>
                    </ul>
                </div>
            </div>

            <div class="mt-8 p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                <h3 class="font-bold text-zinc-900 dark:text-zinc-100 mb-2">Exporting Effects</h3>
                <p class="text-zinc-600 dark:text-zinc-400 text-sm mb-4">Once you are happy with your effect:</p>
                <ol class="list-decimal pl-5 text-sm text-zinc-600 dark:text-zinc-400 space-y-2">
                    <li>Give it a unique name (e.g., <code>BossAura</code>).</li>
                    <li>Click <strong>Save Preset</strong>.</li>
                    <li>In the right panel, find your effect under "Export Effect Data".</li>
                    <li>Click <strong>JSON</strong> to download <code>BossAura.json</code>.</li>
                    <li>Place this file in <code>data/particles/</code>.</li>
                </ol>
            </div>
        </section>

        <!-- COMMANDS -->
        <section id="commands">
            <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                <span class="w-8 h-8 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm border border-indigo-200 dark:border-indigo-800">3</span>
                Plugin Commands
            </h2>

            <div class="space-y-8">
                
                <!-- PlayBabylonEffect -->
                <div class="space-y-3">
                    <h3 class="text-lg font-mono font-bold text-indigo-600 dark:text-indigo-400">PlayBabylonEffect</h3>
                    <p class="text-zinc-600 dark:text-zinc-400 text-sm">Spawns a particle system from a JSON file.</p>
                    
                    <div class="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <table class="w-full text-sm text-left">
                            <thead class="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold">
                                <tr>
                                    <th class="p-3">Argument</th>
                                    <th class="p-3">Description</th>
                                    <th class="p-3">Example</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-zinc-200 dark:divide-zinc-700 bg-white dark:bg-zinc-900">
                                <tr>
                                    <td class="p-3 font-mono text-indigo-600 dark:text-indigo-400">file</td>
                                    <td class="p-3 text-zinc-600 dark:text-zinc-400">Filename without extension.</td>
                                    <td class="p-3 text-zinc-500">Fire</td>
                                </tr>
                                <tr>
                                    <td class="p-3 font-mono text-indigo-600 dark:text-indigo-400">mode</td>
                                    <td class="p-3 text-zinc-600 dark:text-zinc-400"><code>world</code> (3D) or <code>screen</code> (2D UI).</td>
                                    <td class="p-3 text-zinc-500">world</td>
                                </tr>
                                <tr>
                                    <td class="p-3 font-mono text-indigo-600 dark:text-indigo-400">eventId</td>
                                    <td class="p-3 text-zinc-600 dark:text-zinc-400">Target Event ID. 0 for Player.</td>
                                    <td class="p-3 text-zinc-500">0</td>
                                </tr>
                                <tr>
                                    <td class="p-3 font-mono text-indigo-600 dark:text-indigo-400">duration</td>
                                    <td class="p-3 text-zinc-600 dark:text-zinc-400">Time in seconds. <code>-1</code> for Infinite.</td>
                                    <td class="p-3 text-zinc-500">-1</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- StopBabylonEffect -->
                <div class="space-y-3">
                    <h3 class="text-lg font-mono font-bold text-indigo-600 dark:text-indigo-400">StopBabylonEffect</h3>
                    <p class="text-zinc-600 dark:text-zinc-400 text-sm">Removes particles from an event or the screen.</p>
                    <div class="code-block">
StopBabylonEffect
  Target: Event 1
  Method: Natural (Fades out based on particle lifetime)
                    </div>
                </div>

            </div>
        </section>

        <!-- TROUBLESHOOTING -->
        <section id="troubleshooting">
            <h2 class="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                <span class="w-8 h-8 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm border border-indigo-200 dark:border-indigo-800">4</span>
                Troubleshooting & Tips
            </h2>

            <div class="space-y-4">
                <div class="warn">
                    <strong>Issue: Particles appear BEHIND the Skybox/Parallax</strong>
                    <p class="mt-2 text-sm text-orange-900 dark:text-orange-300">
                        This is a common issue in MZ3D due to transparency sorting order.
                        <br><strong>Fix:</strong> The Core Plugin attempts to fix this automatically. If it persists:
                        <br>1. Press <code>Ctrl + I</code> in-game to open the Babylon Inspector.
                        <br>2. Check if your Skybox mesh name contains "skybox" or "parallax".
                        <br>3. Ensure the plugin is updated.
                    </p>
                </div>

                <div class="bg-zinc-50 dark:bg-zinc-900 p-4 rounded border border-zinc-200 dark:border-zinc-800">
                    <h4 class="font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-2">Pre-Warm Cycles</h4>
                    <p class="text-sm text-zinc-600 dark:text-zinc-400">
                        If your infinite effect (like rain or fog) "pops" into existence when the map loads, increase the <strong>Pre-Warm Cycles</strong> in the Physics tab.
                        <br>Formula: <code>Cycles ≈ Lifetime / Speed</code>.
                    </p>
                </div>

                <div class="bg-zinc-50 dark:bg-zinc-900 p-4 rounded border border-zinc-200 dark:border-zinc-800">
                    <h4 class="font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-2">Performance</h4>
                    <p class="text-sm text-zinc-600 dark:text-zinc-400">
                        Keep <strong>Capacity</strong> under 2000 for mobile devices.
                        <br>Use <strong>Simple Colors</strong> instead of Ramp Gradients if you have many simultaneous effects.
                    </p>
                </div>
            </div>
        </section>

    </main>

    <footer class="border-t border-zinc-200 dark:border-zinc-800 mt-20 py-12 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200">
        <div class="max-w-4xl mx-auto px-6 text-center text-zinc-400 text-sm">
            <p>&copy; 2025 MZ Particle Architect. All rights reserved.</p>
            <p class="mt-2">Documentation Version 1.2</p>
        </div>
    </footer>

    <!-- SCRIPT: Fix Anchor Links & Theme Toggle -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // Anchor Links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    const target = document.getElementById(targetId);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                });
            });

            // Theme Toggle Logic
            const toggleBtn = document.getElementById('theme-toggle');
            const html = document.documentElement;
            
            // Check preference (Default to dark for this app)
            if (localStorage.theme === 'light') {
                html.classList.remove('dark');
            } else {
                html.classList.add('dark');
            }

            toggleBtn.addEventListener('click', () => {
                html.classList.toggle('dark');
                localStorage.theme = html.classList.contains('dark') ? 'dark' : 'light';
            });
        });
    </script>
</body>
</html>
`;