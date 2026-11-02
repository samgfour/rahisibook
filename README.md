# RahisiBook kit: set up a new client in about an hour

You only ever edit **config.js** (plus the Supabase steps once per client).

## What is in the kit
| File | What it is |
|---|---|
| `config.js` | The client's name, WhatsApp, services, prices, hours, colours, Supabase keys |
| `index.html` | The booking page clients use (book, My bookings, reschedule, cancel) |
| `dashboard.html` | The owner's page, with a left menu: Overview, Today, Reminders, Bookings, Clients, Services (plus walk-ins) |
| `rahisibook.js`, `style.css` | Shared code and styling. Do not edit per client |
| `schema.sql` | Database setup, run once per client (safe to run again when upgrading) |

## Try it first (2 minutes)
Open `index.html` in a browser. With no Supabase keys it runs in **demo mode**. Data stays in that browser. On `dashboard.html`, any email and password works in demo mode.

## Setting up a client

### 1. Copy the kit
Copy the whole folder and name it after the client, for example `glow-spa`.

### 2. Edit config.js
Spa name, tagline, city, phone, WhatsApp (digits only, start with 254), opening times, closed days, services and prices, colours.
A service with price 0 is hidden from the public page.

### 3. Create the client's Supabase project (about 10 minutes)
1. Go to supabase.com, create a new project for this client (free plan is fine).
2. **SQL Editor > New query**, paste all of `schema.sql`, click **Run**.
3. **Authentication > Users > Add user**. Enter the owner's email and a password, and tick "Auto confirm user". This is the owner's login for the dashboard.
4. **Authentication > Sign In / Providers > Email**. Turn **off** "Allow new users to sign up", so strangers cannot create logins.
5. **Project Settings > API**. Copy the **Project URL** and the **anon public** key into `config.js`.
   Never put the `service_role` key in config.js.

### 4. Test before handing over
- Book a time on `index.html`. Check it shows in `dashboard.html` after signing in.
- Book the same time again. It should say the time was taken.
- Reschedule and cancel from My bookings.
- Try on a phone.

### 5. Put it online
Deploy the folder on Cloudflare (Workers static assets, or Pages), like your other sites. Point the client's domain at it.

## Notes
- Each client has their own Supabase project, so one client's data never mixes with another's.
- Reminders are a one-tap WhatsApp message from the dashboard (the Reminders section, for your next open day). They are not automatic.
- Services and prices: `config.js` only holds the starting list. The first time the owner opens the dashboard, it is saved to the database. After that the owner adds services, changes prices (0 hides one) and removes them in the dashboard **Services** tab, and the booking page updates straight away. The price on a booking comes from the database, not from the visitor.
- Upgrading a client set up with an older copy of the kit: run the new `schema.sql` again (safe to repeat), then replace the files.
- Free Supabase projects pause after a week with no activity. Tell clients to open the dashboard now and then, or upgrade a busy client's plan.
