const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function getNewSize(remValue) {
    const v = parseFloat(remValue);
    if (v >= 1.2) return 'var(--fs-p1)';
    if (v >= 1.0) return 'var(--fs-p2)';
    if (v >= 0.9) return 'var(--fs-p3)';
    if (v >= 0.8) return 'var(--fs-p4)';
    return 'var(--fs-p5)';
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Replace JS/JSX inline styles: fontSize: '0.85rem' or fontSize: "0.85rem"
    content = content.replace(/fontSize:\s*(['"])([0-9.]+)rem\1/g, (match, quote, remVal) => {
        return `fontSize: ${quote}${getNewSize(remVal)}${quote}`;
    });

    // Replace CSS styles: font-size: 0.85rem;
    content = content.replace(/font-size:\s*([0-9.]+)rem\s*;/g, (match, remVal) => {
        return `font-size: ${getNewSize(remVal)};`;
    });

    // Handle any inline styles that might use standard font-size in css string templates if any
    
    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
            processFile(fullPath);
        }
    }
}

walkDir(srcDir);
console.log('Finished standardizing font sizes.');
