# ZENITH 2027 — IIST Inter-College Sports Fest Portal

Official sports registration and payment verification web app for **ZENITH 2027** (Indian Institute of Space Science and Technology, Thiruvananthapuram), built with **Next.js App Router + Tailwind CSS + Supabase**.

## Features

- **7 Official Sports (from ZENITH Brochure)**:
  1. **Football** — ₹75K Prize Pool • ₹5,000/team • League + Playoffs
  2. **Cricket** — ₹75K Prize Pool • ₹5,000/team • League + Playoffs
  3. **Basketball** (Men's ₹45K / ₹3,500 • Women's ₹25K / ₹2,500)
  4. **Volleyball** — ₹45K Prize Pool • ₹3,500/team • Knockout
  5. **Chess** — ₹35K Prize Pool • ₹1,750/team • Swiss and Playoffs
  6. **Badminton** — ₹40K Prize Pool • ₹4,000/team • Mixed Team (MD, MD, MS, WS, XD)
  7. **Table Tennis** (Men's ₹15K / ₹1,750 • Women's Individual ₹7.5K / ₹700)
- **Strict Access Flow**:
  - Public visitors can browse all 7 sports, rules, prize pools, fees, and coordinator contacts.
  - Clicking **Register** requires **Google Sign-In**.
  - First-time users must complete their **Athlete & University Profile** (`/profile`) before `/register` unlocks.
- **Pay-to-Screenshot Flow**:
  - Dynamically generated scannable **UPI QR code** per sport/category fee + UTR/Transaction reference + screenshot upload (`PNG`/`JPG`/`WEBP`, max 5 MB) stored securely in a private Supabase Storage bucket (`payment-screenshots`).
- **Admin Verification Dashboard (`/admin`)**:
  - View all registrations, filter by sport/status/search, inspect full-size payment screenshots in a lightbox, export CSV, and click **Approve → Success** (or **Reject** with a remark).
  - User profile immediately reflects **`Pending` → `Success`**.

---

## Setup Instructions (Supabase + Google Auth)

### 1. Create Supabase Project & Run Schema
1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** in your Supabase Dashboard, copy the entire contents of [`supabase/schema.sql`](supabase/schema.sql), and run it.
   This creates:
   - `public.profiles`
   - `public.registrations`
   - Private storage bucket `payment-screenshots`
   - Row Level Security (RLS) policies + Google profile auto-creation trigger.

### 2. Enable Google OAuth in Supabase
1. In Google Cloud Console, create OAuth 2.0 Web Client credentials:
   - Authorized redirect URI: `https://<YOUR-PROJECT-REF>.supabase.co/auth/v1/callback`
2. In Supabase Dashboard → **Authentication → Providers → Google**, paste your Google Client ID and Client Secret and enable it.
3. In Supabase Dashboard → **Authentication → URL Configuration**:
   - Site URL: `http://localhost:3000` (and your production URL when deployed)
   - Additional Redirect URLs: `http://localhost:3000/auth/callback`

### 3. Configure Environment Variables
Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_UPI_ID` (your official fest UPI ID for the QR code)
- `NEXT_PUBLIC_UPI_NAME`
- Optional: `ADMIN_EMAILS` + `SUPABASE_SERVICE_ROLE_KEY`

### 4. Grant Admin Access
After signing in once with Google, run this in Supabase SQL Editor:

```sql
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'your-admin-email@gmail.com';
```

### 5. Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
