import sys
import requests
import json

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = "http://localhost:5000/api"

def run_tests():
    print("==================================================")
    print("      KUMBHSTAY PART 6 COMPREHENSIVE TEST SUITE   ")
    print("==================================================")
    
    # 1. Login or Register Pilgrim
    print("\n--- 1. Authenticating Pilgrim User ---")
    pilgrim_creds = {
        "name": "Arun Pilgrim",
        "email": "arun.pilgrim@kumbhstay.com",
        "phone": "+919811223344",
        "password": "Password@123",
        "role": "pilgrim"
    }
    
    login_res = requests.post(f"{BASE_URL}/auth/login", json={"email": pilgrim_creds["email"], "password": pilgrim_creds["password"]})
    if login_res.status_code != 200:
        reg_res = requests.post(f"{BASE_URL}/auth/register", json=pilgrim_creds)
        assert reg_res.status_code in [200, 201], f"Pilgrim registration failed: {reg_res.text}"
        pilgrim_data = reg_res.json()
    else:
        pilgrim_data = login_res.json()
    
    pilgrim_token = pilgrim_data["token"]
    pilgrim_id = pilgrim_data["user"].get("_id") or pilgrim_data["user"].get("id")
    print(f"✓ Pilgrim authenticated (User ID: {pilgrim_id})")
    pilgrim_headers = {"Authorization": f"Bearer {pilgrim_token}"}

    # 2. Login or Register Owner
    print("\n--- 2. Authenticating Owner User ---")
    owner_creds = {
        "name": "Varanasi Host",
        "email": "host.part6@kumbhstay.com",
        "phone": "+919876543210",
        "password": "Password@123",
        "role": "owner"
    }
    login_res = requests.post(f"{BASE_URL}/auth/login", json={"email": owner_creds["email"], "password": owner_creds["password"]})
    if login_res.status_code != 200:
        reg_res = requests.post(f"{BASE_URL}/auth/register", json=owner_creds)
        assert reg_res.status_code in [200, 201], f"Owner registration failed: {reg_res.text}"
        owner_data = reg_res.json()
    else:
        owner_data = login_res.json()

    owner_token = owner_data["token"]
    owner_id = owner_data["user"].get("_id") or owner_data["user"].get("id")
    print(f"✓ Owner authenticated (User ID: {owner_id})")
    owner_headers = {"Authorization": f"Bearer {owner_token}"}
    
    print(f"✓ Owner authenticated (User ID: {owner_id})")
    owner_headers = {"Authorization": f"Bearer {owner_token}"}

    # 3. Create a Property for this Host & Admin Approve It
    print("\n--- 3. Creating Property for this Host and Approving it as Admin ---")
    new_prop = {
        "title": "Sangam Divya Ashram Stay Part 6",
        "propertyType": "ashram",
        "address": "Sector 1 Sangam Marg",
        "city": "Prayagraj",
        "pincode": "211005",
        "pricePerNight": 1500,
        "latitude": 25.4300,
        "longitude": 81.8840,
        "amenities": ["wifi", "hotWater", "attachedBathroom", "pureVegFood"],
    }
    create_p_res = requests.post(f"{BASE_URL}/properties", json=new_prop, headers=owner_headers)
    assert create_p_res.status_code in [200, 201], f"Failed to create property: {create_p_res.text}"
    target_property = create_p_res.json().get("property") or create_p_res.json()
    prop_id = target_property["_id"]
    print(f"✓ Host created property: '{target_property['title']}' (ID: {prop_id})")

    # Admin login & approve property
    admin_login = requests.post(f"{BASE_URL}/auth/login", json={"email": "admin@kumbhstay.com", "password": "Admin@123456"})
    assert admin_login.status_code == 200, f"Admin login failed: {admin_login.text}"
    admin_token = admin_login.json()["token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    verify_res = requests.post(
        f"{BASE_URL}/admin/properties/{prop_id}/verify",
        json={
            "status": "verified",
            "adminNotes": "Physical audit completed. Ready for pilgrim bookings.",
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
    assert verify_res.status_code == 200, f"Admin verification failed: {verify_res.text}"
    print(f"✓ Property verified by Admin for public bookings.")

    # 4. Booking Validation: Invalid Dates
    print("\n--- 4. Testing Date Constraint Validation (checkIn >= checkOut) ---")
    invalid_booking = {
        "propertyId": prop_id,
        "checkIn": "2027-01-20",
        "checkOut": "2027-01-18", # Invalid: earlier than checkIn
        "guests": 2,
        "guestName": "Arun Pilgrim",
        "guestPhone": "+919811223344"
    }
    inv_res = requests.post(f"{BASE_URL}/bookings", json=invalid_booking, headers=pilgrim_headers)
    assert inv_res.status_code == 400, f"Expected 400 for invalid dates, got {inv_res.status_code}"
    print(f"✓ Correctly rejected invalid date range with 400: {inv_res.json().get('message')}")

    # 5. Booking Creation: Valid Booking Request
    print("\n--- 5. Submitting Valid Booking Request ---")
    valid_booking = {
        "propertyId": prop_id,
        "checkIn": "2027-01-14",
        "checkOut": "2027-01-17", # 3 nights
        "guests": 3,
        "guestName": "Arun Pilgrim & Family",
        "guestPhone": "+919811223344",
        "guestEmail": "arun.pilgrim@kumbhstay.com"
    }
    book_res = requests.post(f"{BASE_URL}/bookings", json=valid_booking, headers=pilgrim_headers)
    assert book_res.status_code in [200, 201], f"Booking creation failed: {book_res.text}"
    booking_data = book_res.json().get("booking") or book_res.json()
    booking_id = booking_data["_id"]
    total_nights = booking_data["totalNights"]
    total_amount = booking_data["totalAmount"]
    print(f"✓ Booking created successfully!")
    print(f"  Booking ID: {booking_id}")
    print(f"  Total Nights: {total_nights}")
    print(f"  Total Estimated Amount: ₹{total_amount}")
    print(f"  Status: {booking_data['status']}")
    assert total_nights == 3, f"Expected 3 nights, got {total_nights}"

    # 6. Fetch Pilgrim's Bookings
    print("\n--- 6. Testing GET /api/bookings/my ---")
    my_books_res = requests.get(f"{BASE_URL}/bookings/my", headers=pilgrim_headers)
    assert my_books_res.status_code == 200, "Failed to get pilgrim bookings"
    my_bookings = my_books_res.json().get("bookings") or my_books_res.json()
    assert len(my_bookings) > 0, "No bookings returned for pilgrim"
    assert any(b["_id"] == booking_id for b in my_bookings), "Created booking not in pilgrim list"
    print(f"✓ Retrieved {len(my_bookings)} booking(s) for pilgrim.")

    # 7. Fetch Host's Received Bookings
    print("\n--- 7. Testing GET /api/owner/bookings ---")
    owner_books_res = requests.get(f"{BASE_URL}/owner/bookings", headers=owner_headers)
    assert owner_books_res.status_code == 200, "Failed to get owner bookings"
    owner_bookings = owner_books_res.json().get("bookings") or owner_books_res.json()
    assert len(owner_bookings) > 0, "No bookings returned for owner"
    assert any(b["_id"] == booking_id for b in owner_bookings), "Booking not in host list"
    print(f"✓ Host successfully retrieved {len(owner_bookings)} incoming booking request(s).")

    # 8. Fetch Single Booking with Populated Property
    print(f"\n--- 8. Testing GET /api/bookings/{booking_id} ---")
    single_res = requests.get(f"{BASE_URL}/bookings/{booking_id}", headers=pilgrim_headers)
    assert single_res.status_code == 200, "Failed to get single booking"
    single_data = single_res.json().get("booking") or single_res.json()
    assert "property" in single_data, "Property details missing from booking response"
    print(f"✓ Retrieved booking #{booking_id} for property: '{single_data['property']['title']}'")

    # 9. Status Update: Host Confirms Booking
    print(f"\n--- 9. Testing Status Update PATCH /api/bookings/{booking_id}/status (Host confirm) ---")
    update_res = requests.patch(
        f"{BASE_URL}/bookings/{booking_id}/status", 
        json={"status": "confirmed", "reason": "Host approved request via WhatsApp"}, 
        headers=owner_headers
    )
    assert update_res.status_code == 200, f"Status update failed: {update_res.text}"
    updated_data = update_res.json().get("booking") or update_res.json()
    assert updated_data["status"] == "confirmed", f"Status should be confirmed, got {updated_data['status']}"
    print(f"✓ Host successfully updated booking status to: '{updated_data['status']}'")

    # 10. Pilgrim Cancels Booking
    print("\n--- 10. Testing Pilgrim Booking Cancellation ---")
    cancel_res = requests.patch(
        f"{BASE_URL}/bookings/{booking_id}/status",
        json={"status": "cancelled", "cancellationReason": "Trip postponed by pilgrim"},
        headers=pilgrim_headers
    )
    assert cancel_res.status_code == 200, f"Pilgrim cancellation failed: {cancel_res.text}"
    cancelled_data = cancel_res.json().get("booking") or cancel_res.json()
    assert cancelled_data["status"] == "cancelled", "Booking status not cancelled"
    print(f"✓ Pilgrim successfully cancelled booking.")



    # 11. Medical Assistance Points Directory
    print("\n--- 11. Testing GET /api/medical-points (Kumbh Health Assistance) ---")
    med_res = requests.get(f"{BASE_URL}/medical-points")
    assert med_res.status_code == 200, "Failed to get medical points"
    med_points = med_res.json().get("medicalPoints") or med_res.json()
    assert len(med_points) > 0, "No medical points returned"
    print(f"✓ Retrieved {len(med_points)} verified Kumbh medical points.")
    for p in med_points[:3]:
        print(f"  • [{p['type']}] {p['name']} - {p['address']}, {p['city']} (Phone: {p['phone']})")

    # 12. Medical Points GPS Proximity Calculation
    print("\n--- 12. Testing GPS Proximity Distance Calculation for Medical Points ---")
    # Coordinates of Sangam Ghat: 25.4300, 81.8840
    prox_res = requests.get(f"{BASE_URL}/medical-points?lat=25.4300&lng=81.8840")
    assert prox_res.status_code == 200, "Failed to get medical points with proximity"
    prox_points = prox_res.json().get("medicalPoints") or prox_res.json()
    assert len(prox_points) > 0, "No proximity points returned"
    assert "distanceKm" in prox_points[0], "distanceKm field missing from proximity response"
    print(f"✓ Proximity sorting working: Nearest medical point to Sangam is '{prox_points[0]['name']}' at {prox_points[0]['distanceKm']} km away.")

    # 13. Medical Points Type Filtering
    print("\n--- 13. Testing Medical Points Filtering by Type ---")
    booth_res = requests.get(f"{BASE_URL}/medical-points?type=Medical Booth")
    assert booth_res.status_code == 200, "Failed to get booths"
    booth_points = booth_res.json().get("medicalPoints") or booth_res.json()
    assert all(p["type"] == "Medical Booth" for p in booth_points), "Non-booth returned in filtered query"
    print(f"✓ Filtered query returned {len(booth_points)} 'Medical Booth' locations.")

    print("\n==================================================")
    print("  ALL PART 6 REQUIREMENTS SUCCESSFULLY VERIFIED! ")
    print("==================================================")

if __name__ == "__main__":
    run_tests()

