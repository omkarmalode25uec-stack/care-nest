import sys
import requests

sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:5000/api"

def verify():
    print("=" * 75)
    print("      NASHIK DEMO ACCOMMODATION VERIFICATION       ")
    print("=" * 75)

    res = requests.get(f"{BASE_URL}/properties")
    assert res.status_code == 200, f"Error: {res.text}"
    props = res.json().get("properties", [])
    print(f"\nTotal Demo Accommodations in Nashik: {len(props)}")
    for p in props:
        print(f"  ✓ {p['title']} | {p['propertyType'].upper()} | {p['city']}, {p['state']} | ₹{p['pricePerNight']}/night | {p['distanceFromKumbh']}")
        assert p["locationScope"] == "nashik", "Error: locationScope is not nashik"
        assert p["state"] == "Maharashtra", "Error: state is not Maharashtra"

    print("\n--- Medical Points in Nashik ---")
    med = requests.get(f"{BASE_URL}/medical-points").json().get("medicalPoints", [])
    print(f"Total Medical Points in Nashik: {len(med)}")
    for m in med:
        print(f"  ✓ {m['name']} ({m['type']}) | {m['city']} | Sector: {m.get('sector')}")
        assert m["locationScope"] == "nashik", "Error: locationScope is not nashik"

    print("\n--- Recommended Stays in Nashik ---")
    rec = requests.get(f"{BASE_URL}/properties/recommended").json().get("properties", [])
    print(f"Total Recommended Stays in Nashik: {len(rec)}")
    for r in rec:
        print(f"  ✓ {r['title']} - Trust Score: {r['trustScore']}% | {r.get('recommendationReason')}")
        assert r["locationScope"] == "nashik"

    print("\n" + "=" * 75)
    print("  ALL NASHIK DEMO ACCOMMODATIONS & MEDICAL POINTS VERIFIED 100%  ")
    print("=" * 75)

if __name__ == "__main__":
    verify()
