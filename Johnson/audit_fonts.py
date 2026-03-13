import os, re

target = r'c:\Users\Top Ultimate\Desktop\BIG GUY\Projects\Johnson\Johnson\src'
results = []
for root, dirs, files in os.walk(target):
    for f in files:
        if f.endswith(('.jsx',)):
            fp = os.path.join(root, f)
            with open(fp, 'r', encoding='utf-8') as fh:
                content = fh.read()
            for m in re.finditer(r"fontSize:\s*['\"]([^'\"]+)['\"]", content):
                results.append((os.path.relpath(fp, target), m.group(1)))

for r in sorted(results, key=lambda x: x[0]):
    print(f"{r[0]}: {r[1]}")
