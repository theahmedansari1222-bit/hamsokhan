// Runs in GitHub Actions (see build-posts.yml). Reads the published posts from Supabase and writes:
//   p/ID.html  - one static page per post, with its own title, excerpt and image for WhatsApp / Google
//   sitemap.xml - the main pages, every post and every writer
// If Supabase cannot be reached the script stops WITHOUT touching any file.
import { readFile, writeFile, mkdir, readdir, unlink } from "node:fs/promises";

const SITE = "https://hamsokhan.online"; // change this line if the domain ever changes
const cfg = await readFile("config.js", "utf8");
const SB_URL = cfg.match(/SB_URL\s*=\s*"([^"]+)"/)[1], SB_KEY = cfg.match(/SB_KEY\s*=\s*"([^"]+)"/)[1];
const get = async q => {
  const r = await fetch(`${SB_URL}/rest/v1/${q}`, { headers: { apikey: SB_KEY } });
  if (!r.ok) throw new Error(`${q} -> ${r.status} ${await r.text()}`);
  return r.json();
};

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ud = s => String(s).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);
const fdate = d => ud(new Date(d).toLocaleDateString("ur-PK", { day: "numeric", month: "long", timeZone: "Asia/Karachi" }));
const mins = t => ud(Math.max(1, Math.round(String(t).trim().split(/\s+/).length / 150))) + " منٹ";
const okUrl = u => /^https:\/\/[^\s"'<>]+$/.test(u || "");
const initial = n => {
  const w = String(n || "").trim().split(/\s+/).filter(x => x && !/^(ڈاکٹر|ڈاکٹرہ|پروفیسر|محترم|محترمہ|جناب|مولانا|سید|سیدہ|حکیم|بیگم)$/.test(x));
  return (w[0] || "ل")[0];
};
const excerpt = (t, n) => {
  const c = String(t).replace(/\s+/g, " ").trim();
  if (c.length <= n) return c;
  const k = c.lastIndexOf(" ", n);
  return c.slice(0, k > n * 0.6 ? k : n) + "…";
};
const av = a => `<span class="av">${okUrl(a.photo_url) ? `<img src="${esc(a.photo_url)}" alt="">` : esc(initial(a.name))}</span>`;
const paras = t => String(t).split(/\n\s*\n/).map(p => `<p>${esc(p.trim()).replace(/\n/g, "<br>")}</p>`).join("");
const SHARE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.5l6.8-4M8.6 13.5l6.8 4"/></svg>';

const [posts, st] = await Promise.all([
  get("posts?select=id,title,category,body,cover_url,published_at,author:authors(id,name,bio,photo_url)&status=eq.published&order=published_at.desc&limit=1000"),
  get("settings?select=value&key=eq.site_name")
]);
if (!Array.isArray(posts)) throw new Error("posts is not a list");
const site = (st[0] && st[0].value) || "ہم سخن";

const page = p => {
  const a = p.author || {}, url = `${SITE}/p/${p.id}.html`;
  const lines = String(p.body).split("\n").map(s => s.trim()).filter(Boolean);
  const desc = p.category === "شاعری" ? lines.slice(0, 4).join(" / ") : excerpt(p.body, 155);
  const img = okUrl(p.cover_url) ? p.cover_url : `${SITE}/icon-512.png`;
  const title = `${p.title} | ${site}`;
  const ld = { "@context": "https://schema.org", "@type": "Article", headline: p.title, inLanguage: "ur", datePublished: p.published_at,
    author: { "@type": "Person", name: a.name || "" }, publisher: { "@type": "Organization", name: site }, image: img, mainEntityOfPage: url };
  const data = { id: p.id, title: p.title, category: p.category, body: p.body, author: { id: a.id, name: a.name || "" } };
  const js = o => JSON.stringify(o).replace(/</g, "\\u003c");
  return `<!doctype html>
<html lang="ur" dir="rtl">
<head>
<meta charset="utf-8">
<base href="/">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#FAFAF8">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="${esc(site)}">
<meta property="og:locale" content="ur_PK">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${esc(img)}">
<meta name="twitter:card" content="${okUrl(p.cover_url) ? "summary_large_image" : "summary"}">
<link rel="manifest" href="manifest.json">
<link rel="icon" href="favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="stylesheet" href="style.css">
<link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
<script type="application/ld+json">${js(ld)}</script>
</head>
<body>
<div class="wrap">
  <header><a class="brand" href="index.html">${esc(site)}</a></header>
  <main id="m">
    ${a.id ? `<a class="who" href="writer.html?id=${esc(a.id)}">${av(a)}<span>${esc(a.name)}</span></a>` : ""}
    <h1 class="ttl">${esc(p.title)}</h1>
    <div class="meta"><span class="chip">${esc(p.category)}</span><span>${fdate(p.published_at)} · ${mins(p.body)}</span>
      <button class="ico" id="sh" aria-label="شیئر کریں">${SHARE}</button></div>
    ${okUrl(p.cover_url) ? `<img class="cover" src="${esc(p.cover_url)}" alt="">` : ""}
    <div class="body">${paras(p.body)}</div>
    ${a.id ? `<a class="bio" href="writer.html?id=${esc(a.id)}" style="display:block;text-decoration:none"><div class="who">${av(a)}<b>${esc(a.name)}</b></div><p>${esc(a.bio)}</p></a>` : ""}
  </main>
  <footer id="foot"></footer>
</div>
<script src="config.js"></script>
<script src="app.js"></script>
<script>
const P = ${js(data)};
layout("home");
document.getElementById("sh").onclick = () => sharePost(P, P.author);
</script>
</body>
</html>
`;
};

await mkdir("p", { recursive: true });
const ids = new Set(posts.map(p => String(p.id)));
for (const p of posts) await writeFile(`p/${p.id}.html`, page(p));
for (const f of await readdir("p")) if (/^\d+\.html$/.test(f) && !ids.has(f.slice(0, -5))) await unlink(`p/${f}`);

const main = ["", "writers.html", "submit.html", ...["about", "guidelines", "privacy", "terms", "contact"].map(s => `page.html?slug=${s}`)];
const writers = [...new Set(posts.map(p => p.author && p.author.id).filter(Boolean))].map(i => `writer.html?id=${i}`);
const entry = (path, d) => `  <url><loc>${SITE}/${path}</loc>${d ? `<lastmod>${String(d).slice(0, 10)}</lastmod>` : ""}</url>\n`;
await writeFile("sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  main.map(u => entry(u)).join("") + posts.map(p => entry(`p/${p.id}.html`, p.published_at)).join("") + writers.map(u => entry(u)).join("") + `</urlset>\n`);
console.log(`Built ${posts.length} post page(s), ${writers.length} writer link(s).`);
