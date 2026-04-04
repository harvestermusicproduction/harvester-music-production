import os

files = ['index.html', 'music.html', 'events.html', 'diary.html', 'singers.html', 'scores.html', 'submit.html', 'about.html', 'contact.html']

header_target = '''    <div class="logo">Harvester</div>
    <nav class="nav-links">'''
header_replace = '''    <div class="logo-group" style="display: flex; align-items: center; gap: 1.5rem;">
      <div class="logo">Harvester</div>
      <div class="header-socials" style="display: flex; gap: 0.8rem; font-size: 1rem;">
        <a id="cfg_nav_fb" href="#" target="_blank" style="color: #888; transition: 0.3s;"><i class="fab fa-facebook-f"></i></a>
        <a id="cfg_nav_ig" href="#" target="_blank" style="color: #888; transition: 0.3s;"><i class="fab fa-instagram"></i></a>
        <a id="cfg_nav_yt" href="#" target="_blank" style="color: #888; transition: 0.3s;"><i class="fab fa-youtube"></i></a>
      </div>
    </div>
    <nav class="nav-links">'''

font_awesome = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">'

for fb in files:
    try:
        with open(fb, 'r', encoding='utf-8') as f:
            content = f.read()

        if font_awesome not in content:
            content = content.replace('<link rel="stylesheet" href="styles.css">', 
                                      f'<link rel="stylesheet" href="styles.css">\n  {font_awesome}')
        
        content = content.replace(header_target, header_replace)
        
        with open(fb, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {fb}")
    except Exception as e:
        print(f"Error processing {fb}: {e}")

# Append to styles.css
with open('styles.css', 'a', encoding='utf-8') as f:
    f.write('\n.header-socials a:hover { color: var(--gold) !important; }\n')
print("Updated styles.css")

# Update app.js
with open('app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

target_js = '''      const val = getCfg(el.id);
      
      if (el.tagName === 'IMG') {'''
replace_js = '''      let key = el.id;
      if (key === 'cfg_nav_fb') key = 'cfg_social_fb';
      if (key === 'cfg_nav_ig') key = 'cfg_social_ig';
      if (key === 'cfg_nav_yt') key = 'cfg_social_yt';
      const val = getCfg(key);
      
      if (el.tagName === 'IMG') {'''

if "cfg_nav_fb" not in app_js:
    app_js = app_js.replace(target_js, replace_js)
    with open('app.js', 'w', encoding='utf-8') as f:
        f.write(app_js)
    print("Updated app.js")
