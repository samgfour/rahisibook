# RahisiBook implementation notes

## Current prototype

The public landing page, booking demo, salon dashboard, CSV export, PWA shell, legal pages and authentication prototype are available on the `feature/complete-product-enhancements` branch.

## Next production integration

The current `login.html` and `auth.js` intentionally use `localStorage` only. Do not use them as production authentication. Replace the demo session with a managed identity provider or a server-side authentication service.

Recommended API boundaries:

- `POST /api/auth/signup` — create salon and owner account
- `POST /api/auth/login` — issue an HTTP-only secure session cookie
- `POST /api/auth/logout` — revoke session
- `GET /api/me` — return the authenticated salon and role
- `GET /api/appointments` — return appointments scoped to the salon
- `POST /api/appointments` — validate availability and create a booking
- `PATCH /api/appointments/:id` — update status or reschedule
- `POST /api/payments/mpesa/stk-push` — initiate a payment
- `POST /api/payments/mpesa/callback` — verify the provider callback server-side

Production requirements include password hashing, email/phone verification, rate limiting, CSRF protection, server-side authorization, audit logs and encrypted secrets. Never store passwords, payment credentials or access tokens in `localStorage`.
