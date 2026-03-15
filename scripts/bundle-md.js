// Generates src/js/presentation-content.js from presentation.md
// Run via: npm run bundle-md

const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, '..', 'presentation.md');
const outPath = path.join(__dirname, '..', 'src', 'js', 'presentation-content.js');

const content = fs.readFileSync(mdPath, 'utf8');
const escaped = content.replace(/`/g, '\\`').replace(/\$/g, '\\$');

const output = `// Generated from presentation.md — do not edit directly
// Run \`npm run bundle-md\` to regenerate after editing presentation.md
export const presentationMarkdown = \`${escaped}\`;
`;

fs.writeFileSync(outPath, output, 'utf8');
console.log('Generated', outPath);
