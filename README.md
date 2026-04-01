# ReBuild — Morocco's B2B Construction Marketplace

## Quick Start (2 terminals)

### Terminal 1 — Backend API
```bash
cd ReBuild/backend
npm install
node server.js
# → API running on http://localhost:4000
```

### Terminal 2 — Frontend App
```bash
cd ReBuild/frontend
npm install
npm start
# → App opens at http://localhost:3000
```

---

## Demo Accounts (password: demo1234)

| Account | Email | Role |
|---|---|---|
| Karim Bakkali | karim@btp.ma | General contractor, Casablanca |
| Mohamed Benali | benali@btpma.ma | Real estate developer, Rabat |
| Youssef Amrani | amrani@carrelage.ma | Tiles specialist, Marrakech |
| Fatima Idrissi | fatima@gmail.com | Individual homeowner |

---

## App Screens
1. Login + Register (3-step: personal → company ICE → account type)
2. Home feed — stats, categories, listings
3. Browse — full filters (category, type, city, price, sort)
4. Listing detail — full info, seller profile, ratings, buy/message
5. Post listing — sale or rental with all fields
6. Checkout — delivery options, 3 payment methods, order summary + escrow
7. Order confirmation — full receipt, delivery tracking info
8. Orders — purchases & sales tabs, payout confirmation for sellers
9. Messages — conversation list + chat thread
10. Notifications — all platform events
11. Profile — stats, listings, edit, earnings

---

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET  /api/auth/me
- PUT  /api/auth/profile

### Listings
- GET  /api/listings?category=&type=&city=&search=&sort=&minPrice=&maxPrice=
- GET  /api/listings/mine
- GET  /api/listings/:id
- POST /api/listings (multipart/form-data)
- PUT  /api/listings/:id
- DELETE /api/listings/:id

### Orders
- POST /api/orders
- GET  /api/orders/mine
- GET  /api/orders/:id
- PUT  /api/orders/:id/status

### Messages
- GET  /api/messages/conversations
- GET  /api/messages/:userId
- POST /api/messages

### Other
- GET  /api/notifications
- PUT  /api/notifications/read-all
- POST /api/reviews
- GET  /api/stats/platform
- GET  /api/stats/mine
- GET  /api/users/:id

---

## Real BTP Market Data (MAD, 2025-2026)

| Material | Market price | ReBuild surplus price |
|---|---|---|
| Zellige artisanal 10×10 | 280 MAD/m² | 145 MAD/m² (−48%) |
| Grès cérame 60×60 | 95 MAD/m² | 60 MAD/m² (−37%) |
| Ciment Portland 42.5 | 105-115 MAD/sac | 72 MAD/sac (−33%) |
| Acier HA Fe500 Ø12 | 9 500-10 000 MAD/t | 8 200 MAD/t (−14%) |
| Brique creuse 20×20×40 | 4.80-5.50 MAD/u | 3.20 MAD/u (−35%) |
| Bétonnière 350L | 2 500-3 000 MAD/month new | 280 MAD/day (rental) |

Sources: Batiprix MA, FNBTP, local supplier surveys 2025-2026
