import re

path = r'C:\Users\HP\.gemini\antigravity\brain\6911095d-2022-4203-a169-8a4eb580b299\.system_generated\steps\1018\content.md'
with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

aria_matches = re.findall(r'aria-label="([^"]+)"', text)
print("Aria labels:")
for a in set(aria_matches):
    if any(ext in a.lower() for ext in ['.pdf', '.csv', '.xlsx', '.png', '.jpg', '.json', '.txt', 'file', 'image', 'document']):
        print("  -", a)

strong_matches = re.findall(r'<strong[^>]*>([^<]+)</strong>', text)
print("\nStrong tags:")
for s in set(strong_matches):
    print("  -", s)

# Let's also search for file IDs and download URLs
file_ids = re.findall(r'https://drive\.google\.com/file/d/([a-zA-Z0-9_-]+)', text)
print(f"\nFile IDs found: {set(file_ids)}")

# Let's search for any data array
drive_data_chunks = re.findall(r'\[\"([a-zA-Z0-9_-]{20,})\"', text)
print(f"\nPotential drive IDs: {len(set(drive_data_chunks))}")
for chunk in list(set(drive_data_chunks))[:15]:
    print(" ", chunk)
