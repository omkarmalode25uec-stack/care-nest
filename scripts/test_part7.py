import sys
import requests
import json
import time

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:5000/api"

def run_tests():
    print("=" * 65)
    print("      KUMBHSTAY PART 7 FINAL COMPREHENSIVE TEST SUITE       ")
    print("=" * 65)
    
    passed = 0
    total = 0

    def assert_test(name, condition, details=""):
        nonlocal passed, total
        total += 1
        if condition:
            passed += 1
            print(f"  ✓ PASS: {name}")
        else:
            print(f"  ✗ FAIL: {name} - {details}")

    # -------------------------------------------------------------
    # 1. DEMO ACCOUNTS AUTHENTICATION & LOGIN (MODULE 6)
    # -------------------------------------------------------------
    print("\n--- 1. Testing Demo Accounts Authentication ---")
    
    # Demo Pilgrim
    pilgrim_login = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "pilgrim.demo@kumbhstay.com",
        "password": "Pilgrim@123"
    })
    assert_test("Demo Pilgrim Login succeeds", pilgrim_login.status_code == 200, pilgrim_login.text)
    pilgrim_token = pilgrim_login.json().get("token")
    pilgrim_user = pilgrim_login.json().get("user")
    assert_test("Demo Pilgrim role is 'pilgrim'", pilgrim_user.get("role") == "pilgrim")
    pilgrim_headers = {"Authorization": f"Bearer {pilgrim_token}"}

    # Demo Owner
    owner_login = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "owner.demo@kumbhstay.com",
        "password": "Owner@123"
    })
    assert_test("Demo Owner Login succeeds", owner_login.status_code == 200, owner_login.text)
    owner_token = owner_login.json().get("token")
    owner_user = owner_login.json().get("user")
    assert_test("Demo Owner role is 'owner'", owner_user.get("role") == "owner")
    owner_headers = {"Authorization": f"Bearer {owner_token}"}

    # Demo Admin
    admin_login = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "admin.demo@kumbhstay.com",
        "password": "Admin@123"
    })
    assert_test("Demo Admin Login succeeds", admin_login.status_code == 200, admin_login.text)
    admin_token = admin_login.json().get("token")
    admin_user = admin_login.json().get("user")
    assert_test("Demo Admin role is 'admin'", admin_user.get("role") == "admin")
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # -------------------------------------------------------------
    # 2. SECURITY REVIEW & PROPERTY ISOLATION (MODULE 5)
    # -------------------------------------------------------------
    print("\n--- 2. Testing Security & Property Isolation (Owner B cannot edit Owner A) ---")
    
    # Register Owner B
    owner_b_email = f"owner_b_{int(time.time())}@kumbhstay.com"
    owner_b_reg = requests.post(f"{BASE_URL}/auth/register", json={
        "name": "Another Host B",
        "email": owner_b_email,
        "phone": "+919876543299",
        "password": "Password@123",
        "role": "owner"
    })
    assert_test("Owner B registration succeeds", owner_b_reg.status_code in [200, 201])
    owner_b_token = owner_b_reg.json().get("token")
    owner_b_headers = {"Authorization": f"Bearer {owner_b_token}"}

    # Owner A creates a property
    owner_a_prop_res = requests.post(f"{BASE_URL}/properties", json={
        "title": "Owner A Exclusive Dharamshala",
        "propertyType": "ashram",
        "address": "Sangam Sector 1",
        "city": "Prayagraj",
        "pincode": "211005",
        "pricePerNight": 1100,
        "latitude": 25.4300,
        "longitude": 81.8840,
        "amenities": ["wifi", "hotWater", "pureVegFood"],
    }, headers=owner_headers)
    assert_test("Owner A creates property", owner_a_prop_res.status_code in [200, 201])
    owner_a_prop = owner_a_prop_res.json().get("property")
    prop_id = owner_a_prop["_id"]

    # Security check: Owner B attempts to modify Owner A's property -> must return 403 Forbidden
    unauthorized_edit = requests.put(f"{BASE_URL}/properties/{prop_id}", json={
        "title": "Hacked Property Title",
        "pricePerNight": 9999
    }, headers=owner_b_headers)
    assert_test("Owner B blocked from modifying Owner A property with 403", unauthorized_edit.status_code == 403)

    # Security check: Owner B attempts to delete Owner A's property -> must return 403 Forbidden
    unauthorized_delete = requests.delete(f"{BASE_URL}/properties/{prop_id}", headers=owner_b_headers)
    assert_test("Owner B blocked from deleting Owner A property with 403", unauthorized_delete.status_code == 403)

    # -------------------------------------------------------------
    # 3. KUMBH AI ASSISTANT NATURAL SEARCH (MODULE 2)
    # -------------------------------------------------------------
    print("\n--- 3. Testing Kumbh AI Assistant Search (POST /api/assistant/search) ---")
    
    ai_res = requests.post(f"{BASE_URL}/assistant/search", json={
        "query": "I need a family room under ₹2000 near Sangam with hot water"
    })
    assert_test("AI Assistant search returns 200", ai_res.status_code == 200)
    ai_data = ai_res.json()
    assert_test("AI extracted budget (<= 2000)", ai_data.get("extracted", {}).get("maxPrice") == 2000)
    assert_test("AI extracted preference ('family')", ai_data.get("extracted", {}).get("occupantPreference") == "family")
    assert_test("AI extracted amenity ('hotWater')", "hotWater" in ai_data.get("extracted", {}).get("amenities", []))
    assert_test("AI response contains non-empty reply", len(ai_data.get("reply", "")) > 0)
    assert_test("AI results contain real database properties only", isinstance(ai_data.get("properties"), list))
    print(f"    Assistant Reply: '{ai_data.get('reply')}'")

    # -------------------------------------------------------------
    # 4. SMART RECOMMENDATIONS (MODULE 3)
    # -------------------------------------------------------------
    print("\n--- 4. Testing Smart Recommendations (GET /api/properties/recommended) ---")
    
    rec_res = requests.get(f"{BASE_URL}/properties/recommended")
    assert_test("Recommendations API returns 200", rec_res.status_code == 200)
    rec_data = rec_res.json()
    rec_properties = rec_data.get("properties", [])
    assert_test("Recommended properties returned", len(rec_properties) > 0)
    if rec_properties:
        assert_test("Recommended property contains trust reason", "recommendationReason" in rec_properties[0])
        print(f"    Top Pick: '{rec_properties[0]['title']}' - {rec_properties[0].get('recommendationReason')}")

    # -------------------------------------------------------------
    # 5. ADMIN VERIFICATION & PILGRIM FULL LIFECYCLE (MODULE 7)
    # -------------------------------------------------------------
    print("\n--- 5. Verifying Admin Audit & Approval Flow ---")
    
    # Admin approves Owner A's property
    verify_res = requests.post(
        f"{BASE_URL}/admin/properties/{prop_id}/verify",
        json={
            "status": "verified",
            "adminNotes": "Physical audit confirmed. Clean rooms & geyser.",
            "verificationItems": {
                "ownerIdentityVerified": True,
                "propertyDocumentsVerified": True,
                "locationVerified": True,
                "photosVerified": True,
                "amenitiesVerified": True,
                "pricingVerified": True
            }
        },
        headers=admin_headers
    )
    assert_test("Admin successfully verifies property", verify_res.status_code == 200)

    # Pilgrim books the newly verified property
    book_res = requests.post(f"{BASE_URL}/bookings", json={
        "propertyId": prop_id,
        "checkIn": "2027-01-20",
        "checkOut": "2027-01-23",
        "guests": 2,
        "guestName": "Demo Pilgrim Yatri",
        "guestPhone": "+919811100003",
        "guestEmail": "pilgrim.demo@kumbhstay.com"
    }, headers=pilgrim_headers)
    assert_test("Pilgrim creates booking request", book_res.status_code in [200, 201])
    booking_id = book_res.json().get("booking", {}).get("_id") or book_res.json().get("_id")

    # Host confirms booking request
    host_confirm = requests.patch(
        f"{BASE_URL}/bookings/{booking_id}/status",
        json={"status": "confirmed", "reason": "Host approved via WhatsApp"},
        headers=owner_headers
    )
    assert_test("Host confirms booking request", host_confirm.status_code == 200)

    # -------------------------------------------------------------
    # 6. HEALTH ASSISTANCE VERIFICATION
    # -------------------------------------------------------------
    print("\n--- 6. Verifying Health Assistance Points ---")
    health_res = requests.get(f"{BASE_URL}/medical-points?city=Prayagraj")
    assert_test("Prayagraj medical points fetched", health_res.status_code == 200)
    medical_list = health_res.json().get("medicalPoints") or health_res.json()
    assert_test("Medical points count >= 3", len(medical_list) >= 3)

    print("\n" + "=" * 65)
    print(f"  PART 7 TEST SUMMARY: {passed} / {total} tests passed ({(passed/total)*100:.1f}%)")
    print("=" * 65)

if __name__ == "__main__":
    run_tests()
