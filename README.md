# 📡 Real-Time Device Tracking System

Node.js + Express + WebSocket + Leaflet (OpenStreetMap). Koi database/API key ki zarurat nahi.

## Features
- Live map par sabhi devices ke markers + movement trail
- WebSocket se instant updates (page refresh nahi)
- Online/Offline status (30 sec se update nahi aaya = offline)
- Speed aur battery info, device list pe click = map zoom
- Phone browser se tracking (`/device.html`) - user ki explicit permission ke saath
- Simulator: bina real device ke test karo
- Optional API key security

## Chalane ka tarika
```bash
npm install
npm start                 # terminal 1  -> http://localhost:3000
npm run simulate          # terminal 2  -> 5 fake devices
```
Phone se tracking: phone aur laptop same WiFi par ho, phone me `http://<laptop-ip>:3000/device.html` kholo.
(Note: browser GPS ke liye production me HTTPS zaroori hai.)

## API
| Method | Endpoint | Kaam |
|---|---|---|
| POST | `/api/location` | `{id,name,lat,lng,speed,battery}` bhejo |
| GET | `/api/devices` | sabhi devices ki latest location |
| GET | `/api/devices/:id/history` | last 200 points |
| WS | `/ws` | live updates |

Security: `TRACKER_KEY=secret npm start`, phir devices ko header `x-api-key: secret` bhejna hoga.

ESP32/Arduino GPS module bhi isi POST endpoint par JSON bhej sakta hai.

## Aage badhane ke ideas
MongoDB/PostgreSQL me history, geofencing alerts, login system, Docker deployment.

## ⚠️ Privacy
Sirf apne devices ya un logon ko track karo jinki unhone sahmati di ho.
