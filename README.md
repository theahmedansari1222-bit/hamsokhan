# Hum Sukhan (ہم سخن) — Urdu Writing & Publishing Platform

**Read Urdu columns, short stories, essays and poetry, and submit your own Urdu writing for publication.**

🌐 **Live site:** https://hamsokhan.online
✍️ **Submit your writing:** https://hamsokhan.online/submit.html

اردو کالم، افسانے، مضامین اور شاعری پڑھیں، اور اپنی اردو تحریر اشاعت کے لیے بھیجیں۔

---

## What is this?

Hum Sukhan is a free-to-read, mobile-first website for Urdu literature. Anyone can read published Urdu writing, and any writer can send an Urdu column, story, essay or poem to the editor through a simple web form. No account or sign-up is needed. Every submission is read by the editor before it is published, and each piece appears with the writer's name and short introduction.

The site is designed for Urdu from the ground up: right-to-left layout, the Nastaliq script (Jameel Noori Nastaleeq), Urdu numerals and dates, and comfortable line spacing for reading on a phone. There are no ads and no tracking scripts.

## Who is it for?

- **Urdu writers and poets** looking for a place to publish their work online
- **Columnists, short-story writers and essayists** who want a clean page for their writing
- **Readers** who enjoy Urdu literature and want to discover new writers
- **Editors and small literary groups** who need a simple way to receive and publish Urdu submissions

## What can you publish?

| Category (Urdu) | Meaning |
|---|---|
| کالم | Column / opinion piece |
| افسانہ | Short story / fiction |
| مضمون | Essay / article |
| شاعری | Poetry (ghazal, nazm and more) |

Writing should be in Urdu and be your own original work.

## How to submit your Urdu writing

1. Open the [submission page](https://hamsokhan.online/submit.html) (or tap **تحریر بھیجیں** in the bottom bar).
2. Enter your name, email (kept private), a short introduction, the title, the category and the text. A profile photo and a cover image are optional.
3. Tick the box to accept the privacy policy and publishing guidelines, then send.
4. The editor reviews your piece. It may be published, returned for changes, or declined.

Your email address is visible only to the editor and is never published.

## Features

**For readers**
- Latest writing on the home page, with tabs for each category
- Search by title, writer name or text
- Writer profile pages with all of a writer's published work
- Reading-time estimate and one-tap sharing
- Fast, light pages that work well on slow mobile connections

**For the editor (admin panel)**
- Inbox for reader submissions: read, return, approve or reject
- Manage posts, writers, static pages (About, Privacy, Terms, Guidelines, Contact) and site settings
- Upload covers and profile photos
- One-tap backup download

## Publishing guidelines (summary)

Original work only; credit any quotation; respectful language; facts should be accurate; light editing may be done for spelling and punctuation; no payment is offered for published work. Full text: https://hamsokhan.online/page.html?slug=guidelines

## Privacy (summary)

No accounts for readers, no analytics and no advertising cookies. Submitted emails are used only to contact the writer. Names, introductions, photos and text are public once a piece is approved. The site is hosted on GitHub Pages, data is stored in Supabase, and the font may be requested from Google Fonts. Full text: https://hamsokhan.online/page.html?slug=privacy

## Technology

- **Front end:** plain HTML, CSS and JavaScript, with no build step and no framework
- **Back end:** [Supabase](https://supabase.com) (PostgreSQL, Auth, Storage) with Row Level Security on every table
- **Hosting:** GitHub Pages with a custom domain
- **Client:** a small built-in `fetch` client in `app.js`, so no external library or CDN is needed for the site to load

## Repository layout

Everything lives in the repository root. There are no folders to create, which makes the project easy to manage from a phone.

| File | Purpose |
|---|---|
| `index.html` | Home: latest writing, category tabs, search |
| `article.html` | A single piece of writing |
| `writers.html`, `writer.html` | Writers list and writer profile |
| `submit.html` | Submission form |
| `page.html` | Static pages (About, Privacy, Terms, Guidelines, Contact) |
| `admin.html` | Editor panel (login required, not indexed) |
| `app.js` | Shared code, including the Supabase client |
| `config.js` | Supabase project URL and publishable key |
| `style.css` | All styles |
| `jameel.woff` | Urdu Nastaliq font |
| `supabase.sql` | Database tables, security policies and starter content |
| `robots.txt`, `sitemap.xml` | Search engine files |
| `keep-alive.yml` | Optional scheduled ping that stops the free Supabase project from pausing (copy it to `.github/workflows/`) |

## Run your own copy

1. Create a Supabase project and run `supabase.sql` once in the SQL Editor.
2. Put your project URL and **publishable** key in `config.js`. Never use a `service_role` or secret key in this repository.
3. In Supabase, create an admin user (Authentication → Users), then run: `insert into admins(user_id) select id from auth.users where email='YOUR_EMAIL';`
4. Turn off "Allow new users to sign up" (Authentication → Sign In / Providers).
5. Upload all files to a **public** GitHub repository and enable Settings → Pages → Deploy from a branch → `main` / `(root)`.
6. Optional: add a custom domain. Create four `A` records for the apex domain (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`) and a `CNAME` record for `www` pointing to `YOUR-USERNAME.github.io`, then enter the domain in Settings → Pages and enable **Enforce HTTPS**.
7. Optional: copy `keep-alive.yml` to `.github/workflows/keep-alive.yml`.

## Search engine setup (Google Search Console)

1. Add the site in [Google Search Console](https://search.google.com/search-console) as a **Domain** property (verify with a DNS TXT record) or as a **URL prefix** property.
2. Submit the sitemap: `https://hamsokhan.online/sitemap.xml`.
3. Use URL Inspection → Request indexing for the home page and the submission page.
4. `robots.txt` allows crawling and points to the sitemap. `admin.html` carries a `noindex` tag.

## Security notes

- Row Level Security is enabled on all tables: the public can read only published writing, and only the admin can create, edit or delete content.
- The publishable key in `config.js` is public by design and is protected by those security policies.
- Submission length, image size and image type are limited in the database and storage settings.

## Contact

Use the contact page: https://hamsokhan.online/page.html?slug=contact

## Content rights

All writing published on the site remains the property of its respective authors. Please do not copy or republish it without the author's permission. Sharing links is welcome.

---

**ہم سخن** ایک اردو ادبی پلیٹ فارم ہے جہاں آپ اردو کالم، افسانے، مضامین اور شاعری پڑھ سکتے ہیں اور اپنی تحریر اشاعت کے لیے بھیج سکتے ہیں۔
