import sys
import requests
import json

sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:5000/api"

def run_test():
    print("=" * 80)
    print("      KUMBHSTAY GEOGRAPHIC ISOLATION & SCOPE VERIFICATION TEST       ")
    print("=" * 80)

    # 1. Test GET /api/properties (Default Pilgrim Search)
    print("\n--- 1. Testing Default Pilgrim Discovery API (GET /api/properties) ---")
    res = requests.get(f"{BASE_URL}/properties")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    data = res.json()
    props = data.get("properties", [])
    print(f"Total properties returned on default Prayagraj search: {len(props)}")
    
    for p in props:
        print(f"  - [{p.get('locationScope')}] {p.get('title')} | City: {p.get('city')} | Status: {p.get('dataStatus')}")
        assert p.get("locationScope") == "prayagraj", f"ERROR: Non-Prayagraj property returned in default search: {p.get('title')} ({p.get('locationScope')})"
        assert p.get("dataStatus") in ["production", "demo"], f"ERROR: Reference property returned in Prayagraj search: {p.get('title')}"
        assert "nashik" not in p.get("city", "").lower(), f"ERROR: Nashik city property returned in Prayagraj search: {p.get('title')}"
    print("✓ PASS: Default pilgrim search returns ONLY Prayagraj properties (Zero Nashik properties returned).")

    # 2. Test GET /api/properties?locationScope=nashik (Isolated Reference Search)
    print("\n--- 2. Testing Isolated Reference API (GET /api/properties?locationScope=nashik) ---")
    nashik_res = requests.get(f"{BASE_URL}/properties?locationScope=nashik")
    assert nashik_res.status_code == 200, f"Expected 200, got {nashik_res.status_code}"
    nashik_props = nashik_res.json().get("properties", [])
    print(f"Total properties returned on Nashik reference search: {len(nashik_props)}")

    for p in nashik_props:
        print(f"  - [{p.get('locationScope')}] {p.get('title')} | City: {p.get('city')} | Status: {p.get('dataStatus')}")
        assert p.get("locationScope") == "nashik", f"ERROR: Non-Nashik property in Nashik reference query: {p.get('title')}"
        assert p.get("dataStatus") == "reference", f"ERROR: Non-reference property in Nashik reference query: {p.get('title')}"
    print("✓ PASS: Nashik query returns ONLY Nashik reference properties.")

    # 3. Test Recommended Stays API
    print("\n--- 3. Testing Smart Recommendations (GET /api/properties/recommended) ---")
    rec_res = requests.get(f"{BASE_URL}/properties/recommended")
    assert rec_res.status_code == 200
    rec_props = rec_res.json().get("properties", [])
    for p in rec_props:
        assert p.get("locationScope") == "prayagraj", f"ERROR: Non-Prayagraj in recommendations: {p.get('title')}"
    print(f"✓ PASS: Recommended stays ({len(rec_props)} items) are 100% Prayagraj stays.")

    # 4. Test Medical Points API
    print("\n--- 4. Testing Medical Points Discovery (GET /api/medical-points) ---")
    med_res = requests.get(f"{BASE_URL}/medical-points")
    assert med_res.status_code == 200
    med_points = med_res.json().get("medicalPoints", [])
    for m in med_points:
        print(f"  - [{m.get('locationScope')}] {m.get('name')} | City: {m.get('city')}")
        assert m.get("locationScope") == "prayagraj", f"ERROR: Non-Prayagraj medical point returned: {m.get('name')}"
    print(f"✓ PASS: Default medical points ({len(med_points)} items) are 100% Prayagraj facilities.")

    # 5. Test AI Assistant Query
    print("\n--- 5. Testing Kumbh AI Assistant Search ---")
    ai_res = requests.post(f"{BASE_URL}/assistant/search", json={"query": "I need a family room in Prayagraj under 2000"})
    assert ai_res.status_code == 200
    ai_data = ai_res.json()
    ai_props = ai_data.get("properties", [])
    for p in ai_props:
        assert p.get("locationScope") == "prayagraj", f"ERROR: AI assistant returned non-Prayagraj stay: {p.get('title')}"
    print(f"✓ PASS: AI assistant searches only Prayagraj stays ({len(ai_props)} matched).")

    print("\n" + "=" * 80)
    print("      ALL GEOGRAPHIC ISOLATION & SCOPE TESTS PASSED (100%)       ")
    print("=" * 80)

if __name__ == "__main__":
    run_test()
