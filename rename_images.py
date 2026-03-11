import os
import re
import unicodedata
from pathlib import Path

img_dir = Path('assets/images')
if not img_dir.exists():
    print('Dir not found')
    exit()

def safe_name(filename):
    nfkd = unicodedata.normalize('NFKD', filename)
    name = "".join([c for c in nfkd if not unicodedata.combining(c)])
    name = name.lower()
    name = name.replace(' ', '_')
    # Keep alphanumeric, dot, and underscore
    name = re.sub(r'[^a-z0-9_.]', '', name)
    return name

renames = {}
# Rename on disk
for f in img_dir.iterdir():
    if f.is_file():
        new_name = safe_name(f.name)
        if new_name != f.name:
            renames[f.name] = new_name
            os.rename(f, img_dir / new_name)

print(f"Renamed {len(renames)} files.")

# Update HTML
html_path = Path('index.html')
html = html_path.read_text(encoding='utf-8')

for old_name, new_name in renames.items():
    html = html.replace(f'assets/images/{old_name}', f'assets/images/{new_name}')

html_path.write_text(html, encoding='utf-8')
print("Updated index.html.")
