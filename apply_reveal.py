import os
import re

# Targets that should have fade-in applied
targets = [
    r'<section([^>]*class="[^"]*)(?<!\bfade-in\b)([^"]*"[^>]*)>', # sections without fade-in
    r'<section(?![^>]*class=)([^>]*)>',                             # sections with no class
    r'<div([^>]*class="[^"]*\bsong-work-card\b[^"]*)(?<!\bfade-in\b)([^"]*"[^>]*)>',
    r'<div([^>]*class="[^"]*\bmusic-card\b[^"]*)(?<!\bfade-in\b)([^"]*"[^>]*)>',
    r'<div([^>]*class="[^"]*\bdiary-item\b[^"]*)(?<!\bfade-in\b)([^"]*"[^>]*)>',
    r'<div([^>]*class="[^"]*\bperson-card\b[^"]*)(?<!\bfade-in\b)([^"]*"[^>]*)>',
    r'<div([^>]*class="[^"]*\bscore-box\b[^"]*)(?<!\bfade-in\b)([^"]*"[^>]*)>'
]

def apply_fade_in(content):
    # Rule 1: Handles <section class="..."> or <div class="...">
    content = re.sub(r'(<(section|div)[^>]*class=")([^"]*)(")', 
                     lambda m: m.group(1) + (m.group(3) + ' fade-in' if 'fade-in' not in m.group(3) else m.group(3)) + m.group(4), 
                     content)
    
    # Rule 2: Handles <section> with no class
    content = re.sub(r'<section(?![^>]*class=)([^>]*)>', r'<section class="fade-in"\1>', content)
    
    return content

for filename in os.listdir('.'):
    if filename.endswith('.html'):
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # We only apply to specific structural areas to avoid over-animating
        # Let's target any <section> or specific cards
        new_content = apply_fade_in(content)
        
        if new_content != content:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Global reveal installed on {filename}")
