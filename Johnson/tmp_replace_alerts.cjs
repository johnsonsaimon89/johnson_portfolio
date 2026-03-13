const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else if (fullPath.endsWith('.jsx')) {
            results.push(fullPath);
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src', 'components', 'admin'));
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('alert(')) return;

    // figure out depth to src/utils/toast
    // e.g., src/components/admin/StatsManager.jsx -> depth 0 relative to admin/ -> needs ../../utils/toast
    // src/components/admin/cms/BlogManager.jsx -> depth 1 -> needs ../../../utils/toast
    const baseDir = path.join(__dirname, 'src', 'components', 'admin');
    const relativeToAdmin = path.relative(baseDir, file);
    const depth = relativeToAdmin.split(path.sep).length - 1;
    const prefix = '../'.repeat(depth + 2);
    const relativePath = prefix + 'utils/toast';

    if (!content.includes('utils/toast')) {
        content = `import { toast } from '${relativePath}';\n` + content;
    }

    content = content.replace(/alert\((.*?)\)/g, (match, p1) => {
        const lower = p1.toLowerCase();
        if (lower.includes('error') || lower.includes('invalid') || lower.includes('failed') || lower.includes('no subscriber') || lower.includes('already exists')) {
            return `toast.error(${p1})`;
        } else if (lower.includes('success') || lower.includes('saved') || lower.includes('copied') || lower.includes('approved')) {
            return `toast.success(${p1})`;
        } else {
            return `toast.info(${p1})`;
        }
    });

    fs.writeFileSync(file, content);
    console.log('Updated', file);
});
