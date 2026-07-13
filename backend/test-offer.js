// Test creating an offer via API
const offer = {
  title: 'Test Offer',
  description: 'Testing offer creation',
  discountCode: 'TEST10',
  discountPercent: 10,
  image: 'https://placehold.co/800x400?text=Test+Offer',
  validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
};

console.log('Posting offer:', offer);

fetch('http://localhost:5000/api/offers', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(offer)
})
  .then(async res => {
    console.log('Status:', res.status, res.statusText);
    const text = await res.text();
    try { console.log('Response:', JSON.stringify(JSON.parse(text), null, 2)); }
    catch { console.log('Response text:', text); }
  })
  .catch(err => console.error('Error:', err));
