import os, re

target_dir = r'c:\Users\Top Ultimate\Desktop\BIG GUY\Projects\Johnson\Johnson\src'

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # 1. Reduce large clamp font sizes
    content = re.sub(r"fontSize:\s*'clamp\([^)]*?[456]rem[^)]*?\)'", r"fontSize: '2rem'", content)
    content = re.sub(r"fontSize:\s*'clamp\([^)]*?3rem[^)]*?\)'", r"fontSize: '1.75rem'", content)
    content = re.sub(r"fontSize:\s*'clamp\([^)]*?4vw[^)]*?\)'", r"fontSize: '1.5rem'", content)
    
    # Also fix any hardcoded large remote like fontSize: '4rem', '3rem', '5rem', etc.
    content = re.sub(r"fontSize:\s*'([3456789]\.?\d*rem)'", r"fontSize: '2rem'", content)
    
    # CSS font-sizes
    content = re.sub(r"font-size:\s*clamp\([^)]*?[456]rem[^)]*?\);", r"font-size: 2rem;", content)
    content = re.sub(r"font-size:\s*clamp\([^)]*?3rem[^)]*?\);", r"font-size: 1.75rem;", content)
    content = re.sub(r"font-size:\s*([3456789]\.?\d*rem);", r"font-size: 2rem;", content)

    # 2. Remove purely decorative gradient divs
    # Matches <div style={{... background: 'radial-gradient...' ... }} /> where it's self-closing or empty
    # For safety, let's just replace the style instead of the whole div to not break React closing tags
    content = re.sub(r"background:\s*'(?:radial|linear)-gradient[^}]*'", "background: 'transparent'", content)

    # CSS remaining gradients
    content = re.sub(r"background:\s*(?:radial|linear)-gradient\([^;]+\);", "background: transparent;", content)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {filepath}')

for root, dirs, files in os.walk(target_dir):
    for file in files:
        if file.endswith(('.jsx', '.css', '.js')):
            process_file(os.path.join(root, file))

print('Done')
