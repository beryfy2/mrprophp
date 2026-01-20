import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the tools directory
const toolsDir = path.join(__dirname, 'src', 'pages', 'tools');

// Get all JSX files in the tools directory
const toolFiles = fs.readdirSync(toolsDir).filter(file => file.endsWith('.jsx'));

// Pattern to find the form div
const formStartPattern = /<div className="bg-white border-2 border-green-600 rounded-lg p-6 w-full max-w-md shadow-2xl">[\s\S]*?<\/form>[\s\S]*?<\/div>/;

// Replacement for the form div
const formReplacement = `
              <div className="expert-consultation-form bg-white border-2 border-green-600 rounded-lg p-4 w-full max-w-md shadow-2xl">
                <h3 className="text-green-600 font-semibold text-center">Get Expert Consultation</h3>
                <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); alert('Thank you for your interest! We will contact you soon.'); }}>
                  <input
                    type="text"
                    placeholder="Full Name *"
                    className="form-input w-full p-2 rounded bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    className="form-input w-full p-2 rounded bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Mobile *"
                    className="form-input w-full p-2 rounded bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="form-button w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition-colors text-sm"
                  >
                    REQUEST A CALLBACK
                  </button>
                </form>
              </div>`;

// Process each tool file
toolFiles.forEach(file => {
  try {
    const filePath = path.join(toolsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Ensure the tools.css is imported
    if (!content.includes("import '../../style/tools.css'")) {
      content = content.replace(
        /(import.*?['"]\s*;)/s,
        `$1\nimport '../../style/tools.css';`
      );
    }
    
    // Update the form
    const updatedContent = content.replace(formStartPattern, formReplacement);
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`✅ Updated form in ${file}`);
  } catch (error) {
    console.error(`❌ Error updating ${file}:`, error.message);
  }
});

console.log('🎉 All tool forms have been updated!');
