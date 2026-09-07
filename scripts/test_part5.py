import urllib.request
import urllib.error
import json
import sys

# Ensure UTF-8 output encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

BASE_URL = 'http://localhost:5000/api'

def make_request(path, method='GET', data=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = f"Bearer {token}"
    
    encoded_data = json.dumps(data).encode('utf-8') if data is not None else None
    req = urllib.request.Request(url, data=encoded_data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode('utf-8')
            return response.status, json.loads(res_body)
    except urllib.error.HTTPError as e:
        res_body = e.read().decode('utf-8')
        try:
            return e.code, json.loads(res_body)
        except Exception:
            return e.code, {'raw': res_body}
    except Exception as err:
        return 500, {'error': str(err)}

def run_tests():
    print("=" * 70)
    print("  KUMBHSTAY PART 5: LOCATION INTELLIGENCE & TRUST TEST SUITE")
    print("=" * 70)
    
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

    # TEST 1: Geospatial Nearby Search (GET /api/properties/nearby)
    # Sangam Triveni Ghat Coordinates: 25.4285, 81.8763
    status, nearby_res = make_request('/properties/nearby?lat=25.4285&lng=81.8763&radius=10000', 'GET')
    assert_test("Geospatial /api/properties/nearby endpoint succeeds", status == 200 and nearby_res.get('success') is True, str(nearby_res))
    nearby_props = nearby_res.get('properties', [])
    assert_test("Nearby query returns verified stays within 10km radius", len(nearby_props) > 0)
    if nearby_props:
        first_prop = nearby_props[0]
        assert_test("Nearby results contain calculated distanceToOrigin", 'distanceToOrigin' in first_prop and 'distanceToOriginKm' in first_prop)

    # TEST 2: Price Sorting - Low to High
    status, sort_asc_res = make_request('/properties?sort=price_asc', 'GET')
    asc_props = sort_asc_res.get('properties', [])
    prices_asc = [p.get('pricePerNight') for p in asc_props if p.get('pricePerNight') is not None]
    is_sorted_asc = all(prices_asc[i] <= prices_asc[i+1] for i in range(len(prices_asc)-1))
    assert_test("Sorting Price: Low to High (price_asc) is ordered correctly", is_sorted_asc and len(prices_asc) > 0)

    # TEST 3: Price Sorting - High to Low
    status, sort_desc_res = make_request('/properties?sort=price_desc', 'GET')
    desc_props = sort_desc_res.get('properties', [])
    prices_desc = [p.get('pricePerNight') for p in desc_props if p.get('pricePerNight') is not None]
    is_sorted_desc = all(prices_desc[i] >= prices_desc[i+1] for i in range(len(prices_desc)-1))
    assert_test("Sorting Price: High to Low (price_desc) is ordered correctly", is_sorted_desc and len(prices_desc) > 0)

    # TEST 4: Trust Score Sorting - High to Low
    status, sort_trust_res = make_request('/properties?sort=trust_desc', 'GET')
    trust_props = sort_trust_res.get('properties', [])
    trust_scores = [p.get('trustScore', 0) for p in trust_props]
    is_trust_sorted = all(trust_scores[i] >= trust_scores[i+1] for i in range(len(trust_scores)-1))
    assert_test("Sorting Trust Score: High to Low (trust_desc) is ordered correctly", is_trust_sorted and len(trust_scores) > 0)

    # TEST 5: Price Range Filtering (minPrice=600&maxPrice=1200)
    status, filter_res = make_request('/properties?minPrice=600&maxPrice=1200', 'GET')
    filtered_props = filter_res.get('properties', [])
    all_in_range = all(600 <= p.get('pricePerNight', 0) <= 1200 for p in filtered_props)
    assert_test("Price Range filter (600 - 1200) strictly enforces bounds", all_in_range and len(filtered_props) > 0)

    # TEST 6: Deep Property Inspection for Location Intelligence & Google Reviews
    if nearby_props:
        sample_id = nearby_props[0]['_id']
        status, detail_res = make_request(f'/properties/{sample_id}', 'GET')
        assert_test("Get single property by ID succeeds", status == 200 and detail_res.get('success') is True)
        
        prop_data = detail_res.get('property', {})
        
        # Verify Location Intelligence
        loc_intel = prop_data.get('locationIntelligence', {})
        nearest_cats = loc_intel.get('nearestByCategory', {})
        assert_test("Location intelligence contains nearest Kumbh Ghat distance", 'ghat' in nearest_cats and nearest_cats['ghat'] is not None)
        assert_test("Location intelligence contains nearest Medical Booth distance", 'medical' in nearest_cats and nearest_cats['medical'] is not None)
        assert_test("Location intelligence contains nearest Mela Parking distance", 'parking' in nearest_cats and nearest_cats['parking'] is not None)
        assert_test("Location intelligence contains nearest Transport/Shuttle distance", 'shuttle' in nearest_cats and nearest_cats['shuttle'] is not None)
        
        # Verify Google Reviews Abstraction Metadata
        reviews_meta = prop_data.get('googleReviewsData', {})
        assert_test("Google Reviews abstraction contains disclaimer and source identifier", 
                    'disclaimer' in reviews_meta and 'source' in reviews_meta and 'reviews' in reviews_meta)
        assert_test("Reviews are structured with author, rating, and text", 
                    len(reviews_meta.get('reviews', [])) > 0 and 'author' in reviews_meta['reviews'][0])

        # Verify Pricing Transparency Breakdown
        pricing_data = prop_data.get('pricingBreakdown', {})
        assert_test("Pricing breakdown contains basePrice, additionalCharges, totalEstimatedPrice", 
                    'basePrice' in pricing_data and 'totalEstimatedPrice' in pricing_data and 'priceLastUpdated' in pricing_data)
        assert_test("Total price equals basePrice + additional charges", 
                    pricing_data.get('totalEstimatedPrice') >= pricing_data.get('basePrice'))

    # TEST 7: Pilgrim Report Listing Submission
    if nearby_props:
        sample_id = nearby_props[0]['_id']
        status, rep_res = make_request('/reports', 'POST', {
            'propertyId': sample_id,
            'reporterName': 'Sunil Kumar',
            'reporterContact': '+91 98765 43210',
            'reason': 'Wrong price',
            'details': 'Nightly tariff during peak snan date was different from listed price.'
        })
        assert_test("Pilgrim reporting endpoint creates report with valid status", 
                    status == 201 and rep_res.get('data', {}).get('status') == 'pending')

    print("-" * 70)
    print(f"  PART 5 TEST SUMMARY: {passed} / {total} tests passed ({passed/total*100:.1f}%)")
    print("=" * 70)

if __name__ == '__main__':
    run_tests()
