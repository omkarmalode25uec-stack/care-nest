async function runValidationTests() {
  const base = 'http://localhost:5000/api';
  console.log('====================================================');
  console.log('1. TEST: GET /api/properties (All verified Nashik stays)');
  console.log('====================================================');
  const propsRes = await fetch(base + '/properties');
  const propsData = await propsRes.json();
  const stays = propsData.data || propsData.properties || [];
  console.log('HTTP Status:', propsRes.status, '| Total Stays Count:', stays.length);
  stays.forEach(s => console.log('  [' + s._id + '] ' + s.title + ' | City: ' + s.city + ' | Rs.' + s.pricePerNight + ' | Scope: ' + s.locationScope));

  console.log('\n====================================================');
  console.log('2. TEST: GET /api/properties/recommended');
  console.log('====================================================');
  const recRes = await fetch(base + '/properties/recommended');
  const recData = await recRes.json();
  const recStays = recData.data || recData.properties || [];
  console.log('HTTP Status:', recRes.status, '| Recommended Count:', recStays.length);
  recStays.forEach(s => console.log('  [' + s._id + '] ' + s.title + ' | Scope: ' + s.locationScope + ' | Reason: ' + s.recommendationReason));

  console.log('\n====================================================');
  console.log('3. TEST: GET /api/properties/:id (Direct Valid Stays)');
  console.log('====================================================');
  for (const s of stays.slice(0, 3)) {
    const detailRes = await fetch(base + '/properties/' + s._id);
    const detailData = await detailRes.json();
    console.log('Stay ID ' + s._id + ' -> Status:', detailRes.status, '| Title:', detailData.property?.title || detailData.data?.title);
  }

  console.log('\n====================================================');
  console.log('4. TEST: Location Searches with Regex Characters');
  console.log('====================================================');
  const locSearches = [
    'Nashik',
    'Ramkund',
    'Godavari',
    'Nashik (Ramkund / Godavari)',
    'Nashik (Panchavati / Kalaram)',
    'Trimbakeshwar (Kushavarta Kund)',
    'Tapovan',
    'CBS'
  ];
  for (const loc of locSearches) {
    const res = await fetch(base + '/properties?location=' + encodeURIComponent(loc));
    const data = await res.json();
    const count = (data.data || data.properties || []).length;
    console.log('Search [' + loc + '] -> Status: ' + res.status + ' | Count: ' + count);
  }

  console.log('\n====================================================');
  console.log('5. TEST: GET /api/properties/nearby');
  console.log('====================================================');
  const nearRes = await fetch(base + '/properties/nearby?lat=20.0063&lng=73.7915&radius=10000');
  const nearData = await nearRes.json();
  console.log('Nearby Count:', (nearData.data || nearData.properties || []).length);

  console.log('\n====================================================');
  console.log('6. TEST: GET /api/medical-points');
  console.log('====================================================');
  const medRes = await fetch(base + '/medical-points');
  const medData = await medRes.json();
  const meds = medData.data || medData.medicalPoints || [];
  console.log('HTTP Status:', medRes.status, '| Medical Points Count:', meds.length);
  meds.forEach(m => console.log('  [' + m.name + '] ' + m.city + ' | Scope: ' + m.locationScope));

  console.log('\n====================================================');
  console.log('7. TEST: Payment Route Aliases (Singular and Plural)');
  console.log('====================================================');
  const loginRes = await fetch(base + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'pilgrim.demo@kumbhstay.com', password: 'Pilgrim@123' })
  });
  const { token } = await loginRes.json();

  const bookRes = await fetch(base + '/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ propertyId: stays[0]._id, checkIn: '2026-11-01', checkOut: '2026-11-03', guests: 2 })
  });
  const bookData = await bookRes.json();
  const bookingId = bookData.booking._id;

  const singRes = await fetch(base + '/payment/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ bookingId })
  });
  console.log('POST /api/payment/create-order (Singular) -> Status:', singRes.status);

  const plurRes = await fetch(base + '/payments/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ bookingId })
  });
  console.log('POST /api/payments/create-order (Plural) -> Status:', plurRes.status);

  console.log('\n====================================================');
  console.log('8. TEST: Chatbot Prompts (Nashik Only and Prayagraj Notice)');
  console.log('====================================================');
  const chatbotPrompts = [
    'Find me a stay',
    'Show affordable stays',
    'Show family-friendly stays',
    'Which stays have AC?',
    'Which stays have Wi-Fi?',
    'Show me nearby stays',
    'Show me Prayagraj stays'
  ];
  for (const prompt of chatbotPrompts) {
    const chatRes = await fetch(base + '/assistant/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: prompt })
    });
    const chatData = await chatRes.json();
    console.log('Prompt: ' + prompt);
    console.log('Reply: ' + chatData.reply);
    if (chatData.properties && chatData.properties.length > 0) {
      console.log('Returned Stays: ' + chatData.properties.map(p => p.title + ' (' + p.city + ')').join(', '));
    }
    console.log();
  }

  console.log('\n====================================================');
  console.log('9. TEST: Invalid Property ID (404)');
  console.log('====================================================');
  const invRes = await fetch(base + '/properties/650000000000000000000000');
  console.log('GET /api/properties/650000000000000000000000 -> Status:', invRes.status);
}

runValidationTests();
