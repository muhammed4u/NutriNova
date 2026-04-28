 const fs = require('fs');
const path = require('path');

const files = [
  'index.html',
  'src/js/FoodLogSection.js',
  'src/js/MealDetails.js',
  'src/js/MealSection.js',
  'src/js/ProductsSection.js',
  'src/js/Sidebar.js',
  'src/js/main.js'
];

const replacements = [
  // 1. Specific HTML Structure Replacements First
  [
    /<body class="bg-gray-50 font-sans">/g, 
    `<body class="bg-[#0f172a] font-sans text-slate-200 min-h-screen relative overflow-x-hidden">\n  <div class="fixed inset-0 pointer-events-none z-[-1]">\n    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/20 blur-[120px]"></div>\n    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/20 blur-[120px]"></div>\n  </div>`
  ],
  [
    /<body class="bg-\[#0f172a\] font-sans">/g, // In case it runs twice
    `<body class="bg-[#0f172a] font-sans text-slate-200 min-h-screen relative overflow-x-hidden">\n  <div class="fixed inset-0 pointer-events-none z-[-1]">\n    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/20 blur-[120px]"></div>\n    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/20 blur-[120px]"></div>\n  </div>`
  ],

  // Font
  [/"Inter"/g, '"Outfit"'],
  [/Inter:wght/g, 'Outfit:wght'],
  
  // Backgrounds with negative lookahead to avoid breaking bg-white/90
  [/\bbg-white\b(?!\/)/g, 'bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl'],
  [/\bbg-gray-50\b(?!\/)/g, 'bg-transparent'], // Since body is dark, sections can be transparent or very dark
  [/\bbg-gray-100\b(?!\/)/g, 'bg-slate-800/40 backdrop-blur-md'],
  [/\bbg-gray-200\b(?!\/)/g, 'bg-slate-700/40'],
  
  [/\bbg-white\/90\b/g, 'bg-slate-900/80'],
  [/\bbg-white\/80\b/g, 'bg-slate-900/70'],

  // Borders
  [/\bborder-gray-100\b/g, 'border-slate-800'],
  [/\bborder-gray-200\b/g, 'border-slate-800'],
  [/\bborder-gray-300\b/g, 'border-slate-700'],

  // Text colors
  [/\btext-gray-900\b/g, 'text-white'],
  [/\btext-gray-800\b/g, 'text-slate-100'],
  [/\btext-gray-700\b/g, 'text-slate-200'],
  [/\btext-gray-600\b/g, 'text-slate-300'],
  [/\btext-gray-500\b/g, 'text-slate-400'],
  [/\btext-gray-400\b/g, 'text-slate-500'],

  // Emerald to Violet/Fuchsia theme
  [/\bbg-emerald-50\b(?!\/)/g, 'bg-violet-900/30'],
  [/\bbg-emerald-100\b(?!\/)/g, 'bg-violet-900/50'],
  [/\bbg-emerald-400\b(?!\/)/g, 'bg-violet-400'],
  [/\bbg-emerald-500\b(?!\/)/g, 'bg-violet-500'],
  [/\bbg-emerald-600\b(?!\/)/g, 'bg-violet-600'],
  [/\bbg-emerald-700\b(?!\/)/g, 'bg-violet-700'],
  
  [/\btext-emerald-50\b/g, 'text-violet-50'],
  [/\btext-emerald-500\b/g, 'text-violet-400'],
  [/\btext-emerald-600\b/g, 'text-violet-400'], // Brighten for dark mode
  [/\btext-emerald-700\b/g, 'text-violet-300'],

  [/\bborder-emerald-200\b/g, 'border-violet-500/30'],
  [/\bborder-emerald-400\b/g, 'border-violet-400'],
  [/\bborder-emerald-500\b/g, 'border-violet-500'],
  [/\bborder-emerald-600\b/g, 'border-violet-600'],

  [/\bring-emerald-500\b/g, 'ring-violet-500'],
  
  [/\bfrom-emerald-400\b/g, 'from-violet-500'],
  [/\bfrom-emerald-50\b/g, 'from-violet-900/40'],
  [/\bfrom-emerald-600\b/g, 'from-violet-600'],
  [/\bto-teal-600\b/g, 'to-fuchsia-600'],
  [/\bto-teal-50\b/g, 'to-fuchsia-900/40'],
  [/\bto-green-500\b/g, 'to-fuchsia-500'],
  
  // Specific Button Fixes
  [/\bhover:bg-gray-50\b/g, 'hover:bg-slate-800/50'],
  [/\bhover:bg-gray-100\b/g, 'hover:bg-slate-800'],
  [/\bhover:bg-gray-200\b/g, 'hover:bg-slate-700'],
  [/\bhover:bg-emerald-50\b/g, 'hover:bg-violet-900/50'],
  
  // Specific fix for loading overlay (make it dark)
  [/\bg-slate-900\/40 backdrop-blur-xl border border-slate-700\/50 shadow-2xl z-\[100\]/g, 'bg-[#0f172a] z-[100]'],

  // Specific fix for Sidebar and Header (since bg-white was replaced, let's fix it if we want distinct look)
  // Actually bg-slate-900/40 backdrop-blur-xl looks great for sidebar too!
  
  // Search inputs styling
  [/\bpl-12 pr-4 py-3\.5 border border-gray-300 rounded-xl\b/g, 'pl-12 pr-4 py-3.5 border border-slate-700/50 bg-slate-900/50 rounded-xl text-white placeholder-slate-500'],

  // Input styling in forms
  [/\bbg-gray-50 border border-gray-300\b/g, 'bg-slate-900/50 border border-slate-700/50'],
  [/\bbg-white border border-gray-300\b/g, 'bg-slate-900/50 border border-slate-700/50'],
];

for (const file of files) {
  const filePath = path.join('d:/projects/NutriPlan', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    for (const [regex, replacement] of replacements) {
      content = content.replace(regex, replacement);
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
