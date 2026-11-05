const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");
const { pathToFileURL } = require("node:url");

const rootDir = path.resolve(__dirname, "..");
const distDir = path.resolve(rootDir, "dist");
// Output of `vite build --ssr src/entry-server.tsx` (see package.json "build")
const serverEntry = path.resolve(rootDir, "dist-server", "entry-server.mjs");

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
    prerender: true
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
    prerender: true
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
    prerender: true
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
function renderRouteHtml(template, route, appHtml) {
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

  // Put the real page markup (rendered from the React components) inside #root.
  // data-prerendered-path tells src/main.tsx it can reuse this markup instead of re-rendering it.
  if (appHtml) {
    html = html.replace(
      '<div id="root"></div>',
      `<div id="root" data-prerendered-path="${route.path}">${appHtml}</div>`
    );
  }

  return html;
}

// Date of the last commit that touched site content, used as <lastmod> in the sitemap.
// CI needs the full git history for this (actions/checkout with fetch-depth: 0).
function lastContentChange() {
  try {
    const date = execSync("git log -1 --format=%cs -- src public/images videos index.html", {
      cwd: rootDir,
      encoding: "utf-8"
    }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  } catch {
    // git not available: fall through to today's date
  }
  return new Date().toISOString().slice(0, 10);
}

async function main() {
  if (!fs.existsSync(serverEntry)) {
    console.error("Error: dist-server/entry-server.mjs not found. Run the SSR build first.");
    process.exit(1);
  }
  const { render } = await import(pathToFileURL(serverEntry).href);

  console.log("Generating prerendered route HTML files...");
  for (const route of routes) {
    const dir = path.dirname(route.outFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const appHtml = route.prerender ? await render(route.path) : "";
    fs.writeFileSync(route.outFile, renderRouteHtml(masterHtml, route, appHtml), "utf-8");
    console.log(`✓ Created: ${path.relative(distDir, route.outFile)}`);
  }

  const sitemapPath = path.resolve(distDir, "sitemap.xml");
  if (fs.existsSync(sitemapPath)) {
    const lastmod = lastContentChange();
    const sitemap = fs
      .readFileSync(sitemapPath, "utf-8")
      .replace(/<lastmod>.*?<\/lastmod>/g, `<lastmod>${lastmod}</lastmod>`);
    fs.writeFileSync(sitemapPath, sitemap, "utf-8");
    console.log(`✓ sitemap.xml lastmod set to ${lastmod}`);
  }

  console.log("Prerender & SEO build completed successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
