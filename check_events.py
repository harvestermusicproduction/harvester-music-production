import json, re, urllib.request

with open('config.js', 'r') as f:
    config = f.read()

url_match = re.search(r'URL:\s*"([^"]+)"', config)
key_match = re.search(r'ANON_KEY:\s*"([^"]+)"', config)

url = url_match.group(1)
key = key_match.group(1)

req = urllib.request.Request(f"{url}/rest/v1/events?select=*", headers={"apikey": key, "Authorization": f"Bearer {key}"})
resp = urllib.request.urlopen(req)
events = json.loads(resp.read().decode())

print(f"Loaded {len(events)} events.")
for e in events:
    date = e.get('date', '')
    event_date = e.get('event_date') or date
    title = e.get('title', '')
    
    clean_title = title.replace("'", "\\'")
    onclick = f"openReminderModal('{e['id']}', '{clean_title}', '{event_date}')"
    print(f"TITLE: {title}")
    print(f"ONCLICK: {onclick}")

req2 = urllib.request.Request(f"{url}/rest/v1/diary_media?select=*", headers={"apikey": key, "Authorization": f"Bearer {key}"})
resp2 = urllib.request.urlopen(req2)
media = json.loads(resp2.read().decode())
print(f"\nLoaded {len(media)} diary_media.")
for m in media[-5:]:
    print(m)
