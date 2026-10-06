# VERV — Final Frontend Build

This version intentionally has **no backend, database, server, Docker or Node runtime requirement**. It is the final static/frontend direction for the current phase.

## Included
- VERV cinematic homepage with animated fashion sketches.
- Official VERV logo in navigation/footer.
- Animated DRAWN TO MOVE study cards with 3D pointer motion and shine.
- Retail / wholesale catalog flow.
- Category pages and dedicated product pages.
- Product image gallery and WhatsApp ordering.
- Customer account UI with Google sign-in hook and audience fields (gender, age, governorate).
- Checkout collects name, mobile, delivery address and governorate before WhatsApp.
- Arabic order-success confirmation.
- GET IN TOUCH mail flow to `vervofficial1@gmail.com`.
- Animated THANK YOU / handshake connection section.
- Private local dashboard for products, categories, orders, customers and settings.
- Product search/filter, duplicate product, image removal/replacement controls.
- Catalog JSON backup and restore.
- Google owner Client ID is already placed in `config.js`.

## Important limitation
The dashboard/catalog/orders/customer profiles are stored in this browser's localStorage. This is intentional for the current frontend-only phase. It means the dashboard is not a secure cloud admin system and data does not automatically sync between devices.

## Google sign-in
`config.js` contains the VERV Google OAuth Web Client ID. The Google Console must allow the exact URL/origin where the site is opened.

## Owner
Dashboard owner email: `vervofficial1@gmail.com`.

## WhatsApp
VERV WhatsApp: `201288200543`.
