# Gombisa

Oromo clothing, food, traditional games and cultural events, with a shop.

**Stack:** React (Vite) + Tailwind CSS v4 + Redux Toolkit, Node/Express backend, Supabase (database, auth, storage), Chapa payments (Telebirr and cards), Docker.

## Run it

1. **Supabase:** create a project. In the SQL Editor run, in order:
   `supabase/migrations/001` to `005`, then `supabase/seed.sql`.
   Copy the Project URL, the anon key and the service_role key (Project Settings, API).
2. **Frontend:**
   ```bash
   cd frontend
   cp .env.example .env     # fill in the Supabase URL and anon key
   npm install
   npm run dev              # http://localhost:5173
   ```
   You should already see the shop, events and games from the seed data.
3. **Backend:**
   ```bash
   cd backend
   cp .env.example .env     # fill in Supabase service key and Chapa test key
   npm install
   npm run dev              # http://localhost:4000/health  ->  ok
   ```
4. **Payments (test mode):**
   - Create a Chapa account, stay in test mode, copy the test secret key into `backend/.env`.
   - Chapa must reach your computer: run `ngrok http 4000` (or cloudflared) and put the HTTPS address in `PUBLIC_API_URL`.
   - In the Chapa dashboard add the webhook `https://YOUR-TUNNEL/webhook/chapa` and set the same secret as `CHAPA_WEBHOOK_SECRET`.
   - Use Chapa's documented test card or test number to pay.
5. **Make yourself admin** (after registering in the app), in the Supabase SQL Editor:
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'you@example.com');
   ```
6. **Docker** (when the app works locally): copy `.env.example` to `.env`, then `docker compose up --build`.

## Rules this project follows

- Prices are stored in santim (1 birr = 100). Chapa receives birr.
- The browser sends only product ids and quantities. The server reads real prices.
- An order becomes `paid` only after the server confirms it with Chapa's verify API.
- Secret keys (service role, Chapa) live only in `backend/.env`.

## Before launch

- Replace all sample content, and have a native speaker review every Afaan Oromoo text (`frontend/src/lib/i18n.js`, `name_om`, `description_om`).
- Turn email confirmation back on and set up your own SMTP in Supabase.
- Add your real domain to Supabase Auth URL settings.
- Switch Chapa to live keys after business verification.
