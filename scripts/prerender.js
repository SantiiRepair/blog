const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const distDir = path.resolve(rootDir, "dist");
const publicDir = path.resolve(rootDir, "public");

if (!fs.existsSync(distDir)) {
  console.error("Error: dist directory does not exist. Run vite build first.");
  process.exit(1);
}

const baseHtmlPath = path.resolve(distDir, "index.html");
if (!fs.existsSync(baseHtmlPath)) {
  console.error("Error: dist/index.html not found.");
  process.exit(1);
}

const masterHtml = fs.readFileSync(baseHtmlPath, "utf-8");

const routes = [
  {
    path: "/",
    outFile: path.resolve(distDir, "index.html"),
    title: "SantiiRepair | Santiago Ramirez — Developer, Open-Source & Notes",
    description: "Espacio personal de Santiago Ramirez (SantiiRepair) — desarrollo de software, filosofía open-source, viajes en motocicleta y notas sin filtro.",
    canonical: "https://santiirepair.dev/",
    ogType: "website",
    schema: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://santiirepair.dev/#website",
          "url": "https://santiirepair.dev/",
          "name": "SantiiRepair",
          "description": "Espacio personal de Santiago Ramirez (SantiiRepair) — desarrollo de software, open-source, viajes y notas.",
          "inLanguage": ["es", "en", "de"],
          "publisher": {
            "@id": "https://santiirepair.dev/#person"
          }
        },
        {
          "@type": "Person",
          "@id": "https://santiirepair.dev/#person",
          "name": "Santiago Ramirez",
          "alternateName": ["SantiiRepair", "santiirepair"],
          "url": "https://santiirepair.dev/",
          "image": "https://santiirepair.dev/images/about.png",
          "jobTitle": "Software Developer",
          "knowsAbout": ["Software Development", "Open Source", "Python", "TypeScript", "Go", "React"],
          "sameAs": ["https://github.com/SantiiRepair"]
        }
      ]
    },
    prerenderHtml: `
      <div class="site-layout-root">
        <div class="header">
          <img src="/images/welcum.png" alt="Welcome" class="header-logo" width="280" height="70" />
        </div>
        <div class="flex-container">
          <aside class="sidebar sidebar-left">
            <nav aria-label="Site Navigation">
              <a href="/">Sobre mí</a><br/>
              <a href="/favorites">Favoritos</a><br/>
              <a href="/trips">Viajes</a><br/>
              <a href="/diary">Bitácora</a><br/>
              <a href="https://github.com/SantiiRepair" target="_blank" rel="me noopener noreferrer">GitHub</a>
            </nav>
          </aside>
          <main class="main-content">
            <div class="text-container">
              <div class="about-intro" style="text-align: center;">
                <img src="/images/about.png" alt="Santiago Ramirez (SantiiRepair)" class="about-avatar" width="160" height="160" />
                <h1 class="about-title">Rider fantasma, coder nocturno</h1>
                <div style="color: #f5c764; font-family: monospace; margin: 0.5rem 0;">Santiago Ramirez • <a href="https://github.com/SantiiRepair" rel="me">@SantiiRepair</a></div>
                <p class="about-lead">Carretera de dia, pantalla de noche. Este es mi rincon en internet.</p>
                <p>Vivo entre asfalto y pantalla: de día ruta, de noche código, pelis, música y café.</p>
                <div class="about-tags">
                  <span>rutas</span> <span>noches de codigo</span> <span>cafe tarde</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    `
  },
  {
    path: "/diary",
    outFile: path.resolve(distDir, "diary", "index.html"),
    title: "system_logs (Bitácora) — SantiiRepair",
    description: "system logs",
    canonical: "https://santiirepair.dev/diary",
    ogType: "website",
    noindex: true,
    schema: null
  },
  {
    path: "/trips",
    outFile: path.resolve(distDir, "trips", "index.html"),
    title: "Viajes & Rutas en Moto — SantiiRepair | Santiago Ramirez",
    description: "Rutas y viajes en motocicleta por Venezuela: Páramo de Mérida, Pico Espejo, Choroní, La Azulita y más por Santiago Ramirez.",
    canonical: "https://santiirepair.dev/trips",
    ogType: "article",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Viajes y Rutas en Motocicleta — SantiiRepair",
      "url": "https://santiirepair.dev/trips",
      "description": "Fotografías y memorias de viajes en moto por Venezuela.",
      "author": {
        "@type": "Person",
        "name": "Santiago Ramirez",
        "alternateName": "SantiiRepair"
      }
    },
    prerenderHtml: `
      <div class="site-layout-root">
        <div class="header">
          <img src="/images/welcum.png" alt="Welcome" class="header-logo" width="280" height="70" />
        </div>
        <div class="flex-container">
          <aside class="sidebar sidebar-left">
            <nav aria-label="Site Navigation">
              <a href="/">Sobre mí</a><br/>
              <a href="/favorites">Favoritos</a><br/>
              <a href="/trips">Viajes</a><br/>
              <a href="/diary">Bitácora</a><br/>
              <a href="https://github.com/SantiiRepair" target="_blank" rel="me noopener noreferrer">GitHub</a>
            </nav>
          </aside>
          <main class="main-content">
            <div class="text-container">
              <div style="text-align: center;">
                <h1 style="font-size: large;">The best you ever had is just a memory</h1>
                <p>Rutas en moto: Páramo de Mérida, Pico Espejo, Choroní, Cervecería Mito, Parapente, El Morro, La Azulita, Tasca Alambique, Bahía de Cata.</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    `
  },
  {
    path: "/favorites",
    outFile: path.resolve(distDir, "favorites", "index.html"),
    title: "Favoritos (Películas, Series, Música) — SantiiRepair",
    description: "Colección de películas, series, mascotas y playlist favorita de Santiago Ramirez (SantiiRepair).",
    canonical: "https://santiirepair.dev/favorites",
    ogType: "website",
    schema: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Favoritos — SantiiRepair",
      "url": "https://santiirepair.dev/favorites"
    },
    prerenderHtml: `
      <div class="site-layout-root">
        <div class="header">
          <img src="/images/welcum.png" alt="Welcome" class="header-logo" width="280" height="70" />
        </div>
        <div class="flex-container">
          <aside class="sidebar sidebar-left">
            <nav aria-label="Site Navigation">
              <a href="/">Sobre mí</a><br/>
              <a href="/favorites">Favoritos</a><br/>
              <a href="/trips">Viajes</a><br/>
              <a href="/diary">Bitácora</a><br/>
              <a href="https://github.com/SantiiRepair" target="_blank" rel="me noopener noreferrer">GitHub</a>
            </nav>
          </aside>
          <main class="main-content">
            <div class="text-container">
              <div style="text-align: center;">
                <h1>i eat losers for breakfast</h1>
                <p>Mascotas (Tobby el gato), Películas favoritas (Harry Potter, Meet Joe Black, Wolf of Wall Street), Series (Breaking Bad, The Office, Stranger Things), Música (Spotify Playlist).</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    `
  },
  {
    path: "/nv",
    outFile: path.resolve(distDir, "nv", "index.html"),
    title: "Kuromi: Atrapala — SantiiRepair Arcade",
    description: "Minijuego retro de arcade.",
    canonical: "https://santiirepair.dev/nv",
    ogType: "website",
    noindex: true
  }
];

// Helper to replace or inject tags in HTML
function renderRouteHtml(template, route) {
  let html = template;

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${route.title}</title>`);

  // Replace Description
  html = html.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
    `<meta name="description" content="${route.description}" />`
  );

  // Replace Canonical
  html = html.replace(
    /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
    `<link rel="canonical" href="${route.canonical}" />`
  );

  // Replace OG Tags
  html = html.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:title" content="${route.title}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:description" content="${route.description}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:url" content="${route.canonical}" />`
  );
  html = html.replace(
    /<meta\s+property="og:type"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:type" content="${route.ogType || 'website'}" />`
  );

  // Replace Twitter Tags
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${route.title}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${route.description}" />`
  );

  // If noindex route
  if (route.noindex) {
    html = html.replace(
      /<meta\s+name="robots"\s+content=".*?"\s*\/?>/i,
      `<meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />`
    );
  }

  // Replace Structured Data if route has specific schema, or strip if null
  if (route.schema) {
    const jsonLd = JSON.stringify(route.schema, null, 2);
    html = html.replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/i,
      `<script type="application/ld+json">\n${jsonLd}\n    </script>`
    );
  } else if (route.schema === null) {
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/i, "");
  }

  // Inject fallback prerender content in #root
  if (route.prerenderHtml) {
    html = html.replace('<div id="root"></div>', `<div id="root">${route.prerenderHtml}</div>`);
  }

  return html;
}

// Generate all routes
console.log("Generating prerendered route HTML files...");
for (const route of routes) {
  const dir = path.dirname(route.outFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const rendered = renderRouteHtml(masterHtml, route);
  fs.writeFileSync(route.outFile, rendered, "utf-8");
  console.log(`✓ Created: ${path.relative(distDir, route.outFile)}`);
}

// Ensure all public files and folders are copied to dist
function copyDirSync(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  for (const item of fs.readdirSync(srcDir)) {
    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, item);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✓ Synced to dist: ${path.relative(publicDir, srcPath)}`);
    }
  }
}

copyDirSync(publicDir, distDir);

console.log("Prerender & SEO build completed successfully!");
