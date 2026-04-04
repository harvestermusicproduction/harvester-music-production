import requests
import json
import time

# --- Configuration ---
FIREBASE_PROJECT_ID = "harvester-mp"
SUPABASE_URL = "https://ollfdarbmiahgjaqivpg.supabase.co"
SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sbGZkYXJibWlhaGdqYXFpdnBnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTIxMjY5OCwiZXhwIjoyMDkwNzg4Njk4fQ.y5FOeM6WfFJTEce9Mu0XFhmEJXpof7cZH-Udo5TA0PY"

FIREBASE_REST_URL = f"https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT_ID}/databases/(default)/documents"
SUPABASE_REST_URL = f"{SUPABASE_URL}/rest/v1"

HEADERS = {
    "apikey": SUPABASE_SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

def fetch_firebase_collection(collection_name):
    url = f"{FIREBASE_REST_URL}/{collection_name}"
    print(f"Fetching {collection_name} from Firebase...")
    response = requests.get(url)
    if response.status_code == 200:
        return response.json().get('documents', [])
    else:
        print(f"Error fetching {collection_name}: {response.text}")
        return []

def extract_fields(firebase_doc):
    fields = firebase_doc.get('fields', {})
    data = {}
    for key, value in fields.items():
        if 'stringValue' in value:
            data[key] = value['stringValue']
        elif 'integerValue' in value:
            data[key] = int(value['integerValue'])
        elif 'doubleValue' in value:
            data[key] = float(value['doubleValue'])
        elif 'booleanValue' in value:
            data[key] = value['booleanValue']
        elif 'arrayValue' in value:
            data[key] = [v.get('stringValue') for v in value['arrayValue'].get('values', []) if 'stringValue' in v]
        elif 'timestampValue' in value:
            data[key] = value['timestampValue']
    return data

def push_to_supabase(table_name, payload):
    url = f"{SUPABASE_REST_URL}/{table_name}"
    print(f"Pushing data to Supabase table: {table_name}...")
    response = requests.post(url, headers=HEADERS, data=json.dumps(payload))
    if response.status_code in [200, 201]:
        print(f"Successfully pushed {len(payload)} records to {table_name}.")
    else:
        print(f"Error pushing to {table_name}: {response.text}")

def migrate_music():
    docs = fetch_firebase_collection("songs")
    payload = []
    for doc in docs:
        d = extract_fields(doc)
        payload.append({
            "title": d.get("title", "Untitled"),
            "description": d.get("desc", ""),
            "verse": d.get("verse", ""),
            "cover_url": d.get("cover", ""),
            "audio_url": d.get("youtube", d.get("audio", "")),
            "score_url": d.get("pdf", ""),
            "created_at": d.get("createdAt", None)
        })
    if payload:
        push_to_supabase("music_works", payload)

def migrate_team():
    docs = fetch_firebase_collection("team")
    payload = []
    for doc in docs:
        d = extract_fields(doc)
        payload.append({
            "name": d.get("name", "Unknown"),
            "role": d.get("role", ""),
            "description": d.get("desc", ""),
            "image_url": d.get("img", ""),
            "order_index": d.get("order", 0)
        })
    if payload:
        push_to_supabase("team_members", payload)

def migrate_diary():
    docs = fetch_firebase_collection("diary_events")
    # Due to foreign key relationships, we migrate albums then media
    for doc in docs:
        d = extract_fields(doc)
        album_payload = {
            "title": d.get("title", ""),
            "date": d.get("date", "2026-04-01"),
            "cover_url": d.get("cover", "")
        }
        # Insert album and get ID
        url = f"{SUPABASE_REST_URL}/diary_albums"
        h = HEADERS.copy()
        h["Prefer"] = "return=representation"
        res = requests.post(url, headers=h, data=json.dumps(album_payload))
        if res.status_code in [200, 201]:
            album_id = res.json()[0]['id']
            photos = d.get("photos", [])
            if photos:
                media_payload = [{"album_id": album_id, "media_url": p, "type": "image"} for p in photos]
                push_to_supabase("diary_media", media_payload)
        else:
            print(f"Error inserting album {d.get('title')}: {res.text}")

def migrate_configs():
    # Firebase stores site config in site_config/main
    url = f"{FIREBASE_REST_URL}/site_config/main"
    res = requests.get(url)
    if res.status_code == 200:
        d = extract_fields(res.json())
        payload = [{"key": k, "value": str(v)} for k, v in d.items()]
        # Update or Insert
        url = f"{SUPABASE_REST_URL}/site_config"
        h = HEADERS.copy()
        h["Prefer"] = "resolution=merge-duplicates" # Attempt upsert
        requests.post(url, headers=h, data=json.dumps(payload))
        print("Successfully migrated site configurations.")

if __name__ == "__main__":
    print("--- Starting Automated Migration: Firebase -> Supabase ---")
    migrate_configs()
    migrate_music()
    migrate_team()
    migrate_diary()
    print("--- Migration Completed ---")
