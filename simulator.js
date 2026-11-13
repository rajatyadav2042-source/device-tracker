// Fake devices Lucknow ke around ghoomte hain - testing ke liye
const URL = process.env.URL || 'http://localhost:3000/api/location';
const KEY = process.env.TRACKER_KEY || '';
const devs = ['Truck-1', 'Bike-2', 'Van-3', 'Car-4', 'Scooter-5'].map((name, i) => ({
  id: 'sim-' + (i + 1), name,
  lat: 26.8467 + (Math.random() - 0.5) * 0.08,
  lng: 80.9462 + (Math.random() - 0.5) * 0.08,
  heading: Math.random() * Math.PI * 2, battery: 60 + Math.random() * 40
}));

setInterval(() => {
  for (const d of devs) {
    d.heading += (Math.random() - 0.5) * 0.6;
    const step = 0.0004 + Math.random() * 0.0004;
    d.lat += Math.sin(d.heading) * step;
    d.lng += Math.cos(d.heading) * step;
    d.battery = Math.max(1, d.battery - 0.02);
    fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(KEY && { 'x-api-key': KEY }) },
      body: JSON.stringify({ id: d.id, name: d.name, lat: d.lat, lng: d.lng,
                             speed: +(step * 111000 * 3.6).toFixed(1), battery: Math.round(d.battery) })
    }).catch(e => console.error('send failed:', e.message));
  }
}, 2000);
console.log('Simulator chalu: 5 devices, har 2 sec me update');
