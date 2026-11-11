# Editable portfolio — setup

A bilingual (Spanish/English) portfolio with an animated landing screen, text-only enter button, project hub, categories and subcategories, custom pages, social links, image uploads, and a private admin editor.

## Important: private editing

The website is public, but editing and uploads are protected by Supabase authentication and database/storage policies. Do **not** put a Supabase service-role key in the website. Only the public anon key belongs in `config.js`. There is no public sign-up form; create the single admin account yourself in Supabase.

## 1. Create Supabase project and admin

1. Create a project at [supabase.com](https://supabase.com/).
2. In **Authentication → Users**, add your own email and a strong password. Do not enable public sign-ups.
3. Copy your project's URL and anon/public key from **Project Settings → API**.
4. Open `config.js` and set `supabaseUrl` and `supabaseAnonKey`.

## 2. Create the private content store and image bucket

1. Open `supabase-schema.sql` and replace `YOUR_ADMIN_EMAIL@example.com` with the exact email for the admin account.
2. Run the entire SQL file in Supabase **SQL Editor**.
3. The SQL creates a public-read portfolio row, restricts edits to that authenticated email, and creates a public-read image bucket with uploads/deletes restricted to that email. The public anon key is safe to expose because row-level security is enabled.

## 3. Publish

Serve the repository root as a static website (GitHub Pages works). For local testing, use a local web server rather than opening `index.html` directly, for example `python -m http.server`.

## Edit your portfolio

Open the site and click **Admin**, then sign in. The editor supports Spanish and English text and JSON lists for pages, categories/subcategories, projects, and links. Add a project image by uploading it; the URL is copied so you can paste it into that project's `image` field. To use a looping video on the intro screen, add a video URL and select “Looping video”; for a GIF or still, choose “Image / GIF”.

Example project:

```json
{
  "titleEs": "Identidad visual",
  "titleEn": "Visual identity",
  "categoryEs": "Diseño",
  "categoryEn": "Design",
  "subcategoryEs": "Identidad",
  "subcategoryEn": "Identity",
  "descriptionEs": "Una identidad para una marca independiente.",
  "descriptionEn": "An identity for an independent brand.",
  "image": "https://your-project.supabase.co/storage/v1/object/public/portfolio-media/your-image.jpg",
  "url": "https://example.com"
}
```

Category and subcategory names are used to organize projects; category filters appear automatically when you add projects. Page slugs should be unique and contain no spaces (for example `about` or `contact`).

## Update the admin email

If you change your admin email, update the email in the SQL policies and rerun the policy section after removing/replacing the old policies. Keep Supabase's Row Level Security enabled.
