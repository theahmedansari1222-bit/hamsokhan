const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

async function generateStaticPages() {
  try {
    // اپنے ٹیبل کا نام 'posts' یا جو بھی آپ نے supabase.sql میں رکھا ہے، وہ یہاں لکھیں
    const response = await fetch(`${SUPABASE_URL}/rest/v1/posts?select=id,title,intro,content&status=eq.published`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch data from Supabase');
    const posts = await response.json();

    // اصل article.html کو بطور ٹیمپلیٹ پڑھیں
    const templatePath = path.join(__dirname, 'article.html');
    let baseTemplate = fs.readFileSync(templatePath, 'utf-8');

    posts.forEach(post => {
      // میٹا ٹیگز اور اصل مواد کو HTML میں انجیکٹ کریں
      let staticHtml = baseTemplate
        .replace('<title>ہم سخن</title>', `<title>${post.title} | ہم سخن</title>`)
        .replace('</head>', `
          <meta property="og:title" content="${post.title}" />
          <meta property="og:description" content="${post.intro || ''}" />
          <meta name="description" content="${post.intro || ''}" />
          </head>`)
        .replace('<p>لوڈ ہو رہا ہے…</p>', `
          <h1 class="static-title">${post.title}</h1>
          <div class="static-content">${post.content}</div>
          <script>
            // اگر آپ کا app.js خودکار طور پر ڈیٹا لوڈ کرتا ہے، تو اسے روکنے کے لیے ایک فلیگ دے سکتے ہیں
            window.isStaticPreRendered = true;
          </script>
        `);

      // نئی سٹیٹک فائل بنائیں، جیسے article-3.html
      fs.writeFileSync(path.join(__dirname, `article-${post.id}.html`), staticHtml);
    });

    console.log(`Successfully generated ${posts.length} static articles.`);
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

generateStaticPages();