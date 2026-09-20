const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src/app/dashboard');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Tokens
    content = content.replace(/bg-\[#F9F8F6\]/g, 'bg-canvas');
    content = content.replace(/bg-alabaster/g, 'bg-canvas-muted');
    content = content.replace(/bg-charcoal/g, 'bg-ink');
    content = content.replace(/bg-\[#141414\]/g, 'bg-ink');
    content = content.replace(/text-charcoal/g, 'text-ink');
    content = content.replace(/text-gold/g, 'text-primary');
    content = content.replace(/text-warm-grey/g, 'text-ink-muted');
    content = content.replace(/text-alabaster/g, 'text-canvas');
    content = content.replace(/text-white/g, 'text-canvas'); 
    content = content.replace(/border-charcoal\/10/g, 'border-hairline-dark');
    content = content.replace(/border-charcoal\/15/g, 'border-hairline-dark');
    content = content.replace(/border-charcoal\/20/g, 'border-hairline-dark');
    content = content.replace(/border-charcoal\/30/g, 'border-hairline-dark');
    content = content.replace(/border-charcoal\/40/g, 'border-hairline-dark');
    content = content.replace(/border-charcoal/g, 'border-hairline-dark');
    content = content.replace(/border-amber-200/g, 'border-hairline-dark');
    content = content.replace(/border-gold\/70/g, 'border-primary');
    content = content.replace(/border-gold/g, 'border-primary');
    content = content.replace(/btn-gold-slide/g, 'btn-primary');
    content = content.replace(/btn-outline-luxury/g, 'btn-outline');
    content = content.replace(/shadow-xs/g, '');
    content = content.replace(/shadow-sm/g, '');
    content = content.replace(/shadow-md/g, '');
    content = content.replace(/shadow-lg/g, '');
    content = content.replace(/shadow-2xl/g, '');
    content = content.replace(/shadow-2xs/g, '');

    // AI Slop Replacements
    content = content.replace(/TrueTag Universal Authentication/g, 'Batch Verification Portal');
    content = content.replace(/Cryptographic Physical Security Studio/g, 'Label Printing Studio');
    content = content.replace(/Gemini Vision melissopalynology botanical origin microscope tool/g, 'Pollen Image Classification Tool');
    content = content.replace(/Gemini Vision melissopalynology — classify floral botanical origin from microscope slides/g, 'Pollen Image Classification Tool');
    content = content.replace(/Pan-India Migratory Bloom Planner/g, 'Apiary Transit Planner');
    content = content.replace(/Green Pollination Carbon Credit Tokenizer/g, 'Pollination Yield Ledger');
    content = content.replace(/Interactive FSSAI IS 4941 Adulteration Lab Stress-Tester/g, 'NMR Quality Analysis Module');
    content = content.replace(/DashboardClient/g, 'DashboardClient');

    // Extra touchups
    content = content.replace(/serif text-ink/g, 'text-ink');
    content = content.replace(/serif text-primary/g, 'text-primary font-mono');
    content = content.replace(/serif text-canvas/g, 'text-canvas');
    content = content.replace(/bg-white/g, 'bg-canvas');
    content = content.replace(/bg-\[#121212\]/g, 'bg-ink');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function processDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            replaceInFile(fullPath);
        }
    });
}

processDirectory(directoryPath);
console.log('Sweep completed.');
