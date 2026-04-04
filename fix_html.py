import os
import glob
import re

html_files = glob.glob('*.html')

admin_button_pattern = r'<button[^>]*id="adminOpenBtn"[^>]*>.*?</button>'
admin_link_replacement = '<a href="admin.html" class="btn btn-submit" style="padding: 0.5rem 1rem; font-size: 0.8rem; margin-top: 1rem; display: inline-block; text-decoration:none;">进入控制台 (Access Terminal)</a>'

admin_panel_pattern = r'<div id="adminPanel" class="admin-modal">.*?</div>\s*</div>'

for file in html_files:
    if file == 'admin.html': continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
    orig = content
    content = re.sub(admin_button_pattern, admin_link_replacement, content, flags=re.DOTALL)
    content = re.sub(admin_panel_pattern, '', content, flags=re.DOTALL)
    
    if orig != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file}")
