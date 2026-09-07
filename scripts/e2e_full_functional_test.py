import sys
import requests
import json
import time

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:5000/api"

def run_e2e_test():
    print("=" * 75)
    print("      KUMBHSTAY END-TO-END MASTER FUNCTIONAL & REGRESSION TEST       ")
    print("=" * 75)

    passed = 0
    total = 0

    def test(name, condition, details=""):
        nonlocal passed, total
        total += 1
        if condition:
            passed += 1
            print(f"  ✓ [{passed:02d}] PASS: {name}")
        else:
            print(f"  ✗ [{total:02d}] FAIL: {name} - {details}")

    # -------------------------------------------------------------
    # 1. SERVER HEALTH & PUBLIC ENDPOINTS
    # -------------------------------------------------------------
    print("\n--- 1. Testing API Health & Basic Readiness ---")
    health = requests.get(f"{BASE_URL}/health")
    test("Server responds 200 on /api/health", health.status_code == 200)
    test("Health JSON contains success: true", health.json().get("success") is True)

    # -------------------------------------------------------------
    # 2. AUTHENTICATION & DEMO ACCOUNTS (Pilgrim, Owner, Admin)
    # -------------------------------------------------------------
    print("\n--- 2. Testing Authentication & 1-Click Demo Profiles ---")
    
    # 2.1 Demo Pilgrim
    pilgrim_res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "pilgrim.demo@kumbhstay.com",
        "password": "Pilgrim@123"
    })
    test("Pilgrim login succeeds", pilgrim_res.status_code == 200, pilgrim_res.text)
    pilgrim_token = pilgrim_res.json().get("token")
    pilgrim_headers = {"Authorization": f"Bearer {pilgrim_token}"}
    
    # 2.2 Demo Owner
    owner_res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "owner.demo@kumbhstay.com",
        "password": "Owner@123"
    })
    test("Owner login succeeds", owner_res.status_code == 200, owner_res.text)
    owner_token = owner_res.json().get("token")
    owner_headers = {"Authorization": f"Bearer {owner_token}"}

    # 2.3 Demo Admin
    admin_res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "admin.demo@kumbhstay.com",
        "password": "Admin@123"
    })
    test("Admin login succeeds", admin_res.status_code == 200, admin_res.text)
    admin_token = admin_res.json().get("token")
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # -------------------------------------------------------------
    # 3. PILGRIM DISCOVERY & FILTERING
    # -------------------------------------------------------------
    print("\n--- 3. Testing Pilgrim Discovery, Filters & Sorting ---")
    
    # All verified properties
    props_res = requests.get(f"{BASE_URL}/properties")
    test("Fetch public properties returns 200", props_res.status_code == 200)
    all_props = props_res.json().get("properties", [])
    test("Properties list is non-empty", len(all_props) > 0)

    # Filter by propertyType=homestay
    homestay_res = requests.get(f"{BASE_URL}/properties?propertyType=homestay")
    test("Filter homestay returns 200", homestay_res.status_code == 200)
    homestays = homestay_res.json().get("properties", [])
    test("All returned items are homestays", all(p.get("propertyType") == "homestay" for p in homestays))

    # Filter by price bounds (500 - 2000)
    price_res = requests.get(f"{BASE_URL}/properties?minPrice=500&maxPrice=2000")
    test("Filter price range (500-2000) returns 200", price_res.status_code == 200)
    price_props = price_res.json().get("properties", [])
    test("All returned items respect price range", all(500 <= p.get("pricePerNight", 0) <= 2000 for p in price_props))

    # Sort Price: Low to High
    sort_asc_res = requests.get(f"{BASE_URL}/properties?sort=price_asc")
    asc_props = sort_asc_res.json().get("properties", [])
    prices = [p.get("pricePerNight", 0) for p in asc_props]
    test("Sort price_asc is monotonic non-decreasing", prices == sorted(prices))

    # Single Property inspection
    sample_prop = all_props[0]
    sample_id = sample_prop["_id"]
    single_res = requests.get(f"{BASE_URL}/properties/{sample_id}")
    test("Fetch single property by ID returns 200", single_res.status_code == 200)
    single_data = single_res.json().get("property", {})
    test("Property details contain location intelligence distance points", "distancePoints" in single_data or "locationIntelligence" in single_data)
    test("Property details contain pricing breakdown", "pricingBreakdown" in single_data)
    test("Property details contain Google reviews data/adapter", "googleReviews" in single_data or "reviews" in single_data)

    # -------------------------------------------------------------
    # 4. SMART RECOMMENDATIONS & AI ASSISTANT
    # -------------------------------------------------------------
    print("\n--- 4. Testing Smart Recommendations & AI Assistant ---")
    
    # Recommendations
    rec_res = requests.get(f"{BASE_URL}/properties/recommended")
    test("GET /api/properties/recommended returns 200", rec_res.status_code == 200)
    rec_props = rec_res.json().get("properties", [])
    test("Recommendations list is non-empty", len(rec_props) > 0)
    test("Top recommended stay has recommendationReason tag", "recommendationReason" in rec_props[0])

    # AI Assistant Natural Query
    ai_res = requests.post(f"{BASE_URL}/assistant/search", json={
        "query": "Looking for a clean homestay under 1800 with wifi in Prayagraj"
    })
    test("POST /api/assistant/search returns 200", ai_res.status_code == 200)
    ai_data = ai_res.json()
    test("AI extracted maxPrice correctly", ai_data.get("extracted", {}).get("maxPrice") == 1800)
    test("AI extracted propertyType ('homestay')", ai_data.get("extracted", {}).get("propertyType") == "homestay")
    test("AI extracted amenity ('wifi')", "wifi" in ai_data.get("extracted", {}).get("amenities", []))
    test("AI generated non-empty reply", len(ai_data.get("reply", "")) > 0)

    # -------------------------------------------------------------
    # 5. OWNER PROPERTY MANAGEMENT & AUDIT WORKFLOW
    # -------------------------------------------------------------
    print("\n--- 5. Testing Host Accommodation Onboarding & Admin Audit ---")
    
    # Owner creates draft property
    new_stay_payload = {
        "title": f"Maha Kumbh Yatri Ashram {int(time.time())}",
        "propertyType": "ashram",
        "address": "Sector 3 Sangam Road, Daraganj",
        "city": "Prayagraj",
        "pincode": "211005",
        "pricePerNight": 1200,
        "latitude": 25.4330,
        "longitude": 81.8700,
        "amenities": ["wifi", "hotWater", "pureVegFood", "attachedBathroom"],
        "occupantPreferences": ["family", "seniorCitizen"],
        "images": ["https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80"],
    }
    create_res = requests.post(f"{BASE_URL}/properties", json=new_stay_payload, headers=owner_headers)
    test("Owner creates accommodation (201)", create_res.status_code in [200, 201])
    created_prop = create_res.json().get("property")
    created_id = created_prop["_id"]
    test("Created accommodation status is draft or pending", created_prop.get("verificationStatus") in ["draft", "pending"])

    # Owner submits for physical verification
    submit_res = requests.post(f"{BASE_URL}/properties/{created_id}/submit", headers=owner_headers)
    test("Owner submits for physical audit (200)", submit_res.status_code == 200)

    # Admin verifies and approves property
    admin_audit_res = requests.post(f"{BASE_URL}/admin/properties/{created_id}/verify", json={
        "status": "verified",
        "adminNotes": "On-ground audit passed with 100% compliance.",
        "verificationItems": {
            "ownerIdentityVerified": True,
            "propertyDocumentsVerified": True,
            "locationVerified": True,
            "photosVerified": True,
            "amenitiesVerified": True,
            "pricingVerified": True
        }
    }, headers=admin_headers)
    test("Admin verifies property (200)", admin_audit_res.status_code == 200)
    verified_obj = admin_audit_res.json().get("data", {}).get("property") or admin_audit_res.json().get("property") or {}
    test("Property is now 'verified'", verified_obj.get("verificationStatus") == "verified")
    test("Trust score >= 90 generated", verified_obj.get("trustScore", 0) >= 90)


    # -------------------------------------------------------------
    # 6. BOOKING & CONFIRMATION FLOW
    # -------------------------------------------------------------
    print("\n--- 6. Testing Pilgrim Booking & Host WhatsApp Coordination ---")
    
    # Pilgrim books the newly verified property
    book_res = requests.post(f"{BASE_URL}/bookings", json={
        "propertyId": created_id,
        "checkIn": "2027-01-22",
        "checkOut": "2027-01-25",
        "guests": 3,
        "guestName": "Demo Pilgrim Yatri",
        "guestPhone": "+919811100003",
        "guestEmail": "pilgrim.demo@kumbhstay.com"
    }, headers=pilgrim_headers)
    test("Pilgrim creates booking request (201)", book_res.status_code in [200, 201])
    booking_data = book_res.json().get("booking") or book_res.json()
    b_id = booking_data["_id"]
    test("Booking total nights calculated correctly (3 nights)", booking_data.get("totalNights") == 3)
    test("Booking status is 'pending'", booking_data.get("status") == "pending")

    # Host checks incoming bookings
    owner_books = requests.get(f"{BASE_URL}/owner/bookings", headers=owner_headers)
    test("Host retrieves incoming bookings (200)", owner_books.status_code == 200)
    owner_b_list = owner_books.json().get("bookings", [])
    test("Created booking is in host's list", any(b["_id"] == b_id for b in owner_b_list))

    # Host confirms booking
    confirm_res = requests.patch(f"{BASE_URL}/bookings/{b_id}/status", json={
        "status": "confirmed",
        "reason": "Host approved availability via direct coordination"
    }, headers=owner_headers)
    test("Host confirms booking status (200)", confirm_res.status_code == 200)
    test("Booking status is now 'confirmed'", confirm_res.json().get("booking", {}).get("status") == "confirmed")

    # Pilgrim retrieves booking receipt
    receipt_res = requests.get(f"{BASE_URL}/bookings/{b_id}", headers=pilgrim_headers)
    test("Pilgrim retrieves populated booking receipt (200)", receipt_res.status_code == 200)
    receipt_data = receipt_res.json().get("booking", {})
    test("Receipt contains populated property info", "property" in receipt_data and receipt_data["property"] is not None)

    # -------------------------------------------------------------
    # 7. PILGRIM REPORTING & DISPUTE RESOLUTION
    # -------------------------------------------------------------
    print("\n--- 7. Testing Pilgrim Listing Report & Admin Dispute Queue ---")
    
    # Pilgrim reports listing discrepancy
    report_res = requests.post(f"{BASE_URL}/reports", json={
        "propertyId": created_id,
        "reporterName": "Demo Pilgrim Yatri",
        "reporterContact": "+919811100003",
        "reason": "Incorrect amenities",
        "details": "Minor geyser maintenance required in morning shift."
    })
    test("Pilgrim submits discrepancy report (201)", report_res.status_code in [200, 201])
    report_json = report_res.json()
    report_id = (report_json.get("data", {}) or {}).get("_id") or (report_json.get("report", {}) or {}).get("_id")

    # Admin retrieves reports
    admin_reports = requests.get(f"{BASE_URL}/admin/reports", headers=admin_headers)
    test("Admin fetches reports queue (200)", admin_reports.status_code == 200)
    reports_list = admin_reports.json().get("data") or admin_reports.json().get("reports", [])
    test("Created report is in admin queue", any(r["_id"] == report_id for r in reports_list))

    # Admin resolves report
    resolve_res = requests.patch(f"{BASE_URL}/admin/reports/{report_id}", json={
        "status": "resolved",
        "actionTaken": "owner_notified",
        "adminNotes": "Inspection verified that hot water geyser is operational."
    }, headers=admin_headers)
    test("Admin resolves report (200)", resolve_res.status_code == 200, f"code={resolve_res.status_code} body={resolve_res.text}")

    # -------------------------------------------------------------
    # 8. 24/7 HEALTH ASSISTANCE & EMERGENCY NETWORK
    # -------------------------------------------------------------
    print("\n--- 8. Testing Kumbh Health & Emergency System ---")
    
    # Medical points with GPS proximity calculation (Sangam coordinates)
    gps_med = requests.get(f"{BASE_URL}/medical-points?lat=25.4300&lng=81.8840")
    test("Medical points with GPS proximity returns 200", gps_med.status_code == 200)
    med_list = gps_med.json().get("medicalPoints", [])
    test("Medical points list is non-empty", len(med_list) > 0)
    test("Closest point has distanceKm calculated", "distanceKm" in med_list[0])
    test("Closest point has formatted distance string", "formattedDistance" in med_list[0])

    # Filter Emergency Booths
    booths = requests.get(f"{BASE_URL}/medical-points?type=Medical Booth")
    test("Filter Medical Booths returns 200", booths.status_code == 200)
    b_points = booths.json().get("medicalPoints", [])
    test("All returned items are 'Medical Booth'", all(b.get("type") == "Medical Booth" for b in b_points))

    print("\n" + "=" * 75)
    print(f"  END-TO-END MASTER SUITE: {passed} / {total} tests passed ({(passed/total)*100:.1f}%)")
    print("=" * 75)

if __name__ == "__main__":
    run_e2e_test()
