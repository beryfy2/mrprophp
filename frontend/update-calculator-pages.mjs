import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const toolsDir = path.join(__dirname, 'src', 'pages', 'tools');

// Common form template
const formTemplate = `
              <div className="expert-consultation-form bg-white border-2 border-green-600 rounded-lg p-3 w-full max-w-xs shadow-2xl">
                <h3 className="text-green-600 font-semibold text-center text-sm mb-2">Get Expert Consultation</h3>
                <form className="space-y-2" onSubmit={(e) => { e.preventDefault(); alert('Thank you for your interest! We will contact you soon.'); }}>
                  <input
                    type="text"
                    placeholder="Full Name *"
                    className="w-full px-2 py-1 text-xs rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    className="w-full px-2 py-1 text-xs rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Mobile *"
                    className="w-full px-2 py-1 text-xs rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white text-xs py-1.5 rounded font-medium hover:bg-green-700 transition-colors"
                  >
                    REQUEST A CALLBACK
                  </button>
                </form>
              </div>`;

// Process each calculator file
const processFile = (filePath) => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // 1. Add has-fixed-navbar class to root div
    if (!content.includes('has-fixed-navbar') && content.includes('export default function')) {
      content = content.replace(
        /export default function (\w+)\(\) {/,
        'export default function $1() {\n  // Add has-fixed-navbar to prevent navbar overlap\n  return (\n    <div className="has-fixed-navbar">'
      );
      modified = true;
    }

    // 2. Update hero section
    if (!content.includes('calculator-hero') && content.match(/<section[^>]*class=.*?[\"']([^\"']*)[\"']/)) {
      content = content.replace(
        /<section className="emi-hero">[\s\S]*?<\/section>/,
        `<section className="calculator-hero bg-gradient-to-r from-blue-900 to-blue-600 flex items-center pt-24">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-3 text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  ${path.basename(filePath, '.jsx').replace(/([A-Z])/g, ' $1').trim()}
                </h1>
                <p className="text-lg mb-4">
                  Calculate your financial needs with our easy-to-use calculator.
                  Get accurate calculations instantly based on your inputs.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-green-500 text-white px-3 py-1 rounded text-sm">Accurate</span>
                  <span className="bg-green-500 text-white px-3 py-1 rounded text-sm">Fast</span>
                  <span className="bg-green-500 text-white px-3 py-1 rounded text-sm">Reliable</span>
                </div>
              </div>
              <div className="lg:col-span-2 flex justify-end">
                ${formTemplate}
              </div>
            </div>
          </div>
        </section>`
      );
      modified = true;
    }

    // 3. Ensure tools.css is imported if it exists
    const toolsCssPath = path.join(__dirname, 'src', 'style', 'tools.css');
    if (fs.existsSync(toolsCssPath) && !content.includes("import '../../style/tools.css'") && content.includes("import")) {
      content = content.replace(
        /(import.*?['"]\s*;)/s,
        `$1\nimport '../../style/tools.css';`
      );
      modified = true;
    }

    // 4. Add closing div if we added has-fixed-navbar
    if (modified) {
      // Add closing div before the final return statement
      const lastBracket = content.lastIndexOf('}');
      if (lastBracket !== -1) {
        content = content.substring(0, lastBracket) + '\n    </div>\n  ' + content.substring(lastBracket);
      }
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated ${path.basename(filePath)}`);
    } else {
      console.log(`ℹ️  No changes needed for ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
};

// Process all calculator files
const calculatorFiles = [
  'EmiCalculator.jsx',
  'DepreciationCalculator.jsx',
  'FssaiLicenseChecker.jsx',
  'PpfCalculator.jsx'
];

console.log('🔄 Updating calculator pages...');
calculatorFiles.forEach(file => {
  const filePath = path.join(toolsDir, file);
  if (fs.existsSync(filePath)) {
    processFile(filePath);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log('🎉 All calculator pages have been updated!');
