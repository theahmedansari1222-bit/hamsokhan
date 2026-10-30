const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

async function generateStaticPages() {
  try {
    // یہاں درست کالمز (id, title, body) دیے گئے ہیں
    const response = await fetch(`${SUPABASE_URL}/rest/v1/posts?select=id,title,body&status=eq.published`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Supabase Error: ${response.status} - ${errText}`);
    }
    const posts = await response.json();

    const templatePath = path.join(__dirname, 'article.html');
    let baseTemplate = fs.readFileSync(templatePath, 'utf-8');

    posts.forEach(post => {
      // SEO کے لیے باڈی کے شروع کے 150 حروف نکال کر ڈسکرپشن بنانا
      let excerpt = "";
      if (post.body) {
        excerpt = post.body.replace(/(<([^>]+)>)/gi, "").substring(0, 150) + '...';
      }

      let staticHtml = baseTemplate
        .replace('<title>ہم سخن</title>', `<title>${post.title} | ہم سخن</title>`)
        .replace('</head>', `
          <meta property="og:title" content="${post.title}" />
          <meta property="og:description" content="${excerpt}" />
          <meta name="description" content="${excerpt}" />
          </head>`)
        .replace('<p>لوڈ ہو رہا ہے…</p>', `
          <h1 class="static-title">${post.title}</h1>
          <div class="static-content">${post.body}</div>
          <script>
            window.isStaticPreRendered = true;
          </script>
        `);

      fs.writeFileSync(path.join(__dirname, `article-${post.id}.html`), staticHtml);
    });

    console.log(`Successfully generated ${posts.length} static articles.`);
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

generateStaticPages(); 