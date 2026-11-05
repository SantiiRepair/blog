/**
 * Runs after `vite build` and the SSR build (see package.json "build"):
 * - writes one HTML file per page and language (dist/, dist/en/, dist/de/, dist/ru/) with the
 *   page markup rendered from the React components, translated <head> tags, canonical URL and
 *   hreflang alternates
 * - generates dist/sitemap.xml with every language version of each indexable page
 */
const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");
const { pathToFileURL } = require("node:url");

const SITE = "https://santiirepair.dev";
const rootDir = path.resolve(__dirname, "..");
const distDir = path.resolve(rootDir, "dist");
// Output of `vite build --ssr src/entry-server.tsx`
const serverEntry = path.resolve(rootDir, "dist-server", "entry-server.mjs");
const mediaManifest = path.resolve(rootDir, "src", "lib", "media.json");

const OG_LOCALES = { es: "es_VE", en: "en_US", de: "de_DE", ru: "ru_RU" };

const PERSON = {
  "@type": "Person",
  "@id": `${SITE}/#person`,
  name: "Santiago Ramirez",
  alternateName: ["SantiiRepair", "santiirepair"],
  url: `${SITE}/`,
  image: `${SITE}/images/about.png`,
  jobTitle: "Software Developer",
  knowsAbout: ["Software Development", "Open Source", "Python", "TypeScript", "Go", "React"],
  sameAs: ["https://github.com/SantiiRepair"]
};

// Pages that exist in every language. `key` selects the seo_<key>_* texts in src/lib/i18n.ts.
const PAGES = [
  {
    page: "/",
    key: "home",
    ogType: "website",
    prerender: true,
    sitemapImages: ["/images/about.png", "/images/og-image.png"],
    schema: ({ url, lang, description }) => ({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${SITE}/#website`,
          url,
          name: "SantiiRepair",
          description,
          inLanguage: lang,
          publisher: { "@id": `${SITE}/#person` }
        },
        PERSON
      ]
    })
  },
  {
    page: "/trips",
    key: "trips",
    ogType: "article",
    prerender: true,
    sitemapImages: "trips",
    schema: ({ url, lang, title, description }) => ({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      url,
      description,
      inLanguage: lang,
      author: { "@id": `${SITE}/#person`, "@type": "Person", name: "Santiago Ramirez" }
    })
  },
  {
    page: "/favorites",
    key: "favorites",
    ogType: "website",
    prerender: true,
    schema: ({ url, lang, title, description }) => ({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      url,
      description,
      inLanguage: lang
    })
  },
  {
    page: "/diary",
    key: "diary",
    ogType: "website",
    noindex: true,
    description: "system logs"
  }
];

// The secret game: one URL, not translated, not indexed.
const SECRET = {
  path: "/nv/",
  title: "Kuromi: Atrapala — SantiiRepair Arcade",
  description: "Minijuego retro de arcade.",
  noindex: true
};

// Photos shown on /trips, listed in the sitemap at full size.
const TRIP_PHOTOS = [
  "self", "pico", "beach", "mito", "paragliding", "morro", "azulita", "alambique", "bodegon"
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function replaceTag(html, pattern, replacement) {
  if (!pattern.test(html)) {
    throw new Error(`index.html is missing a tag matching ${pattern}`);
  }
  return html.replace(pattern, replacement);
}

function renderHead(template, meta) {
  let html = template;
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);

  html = replaceTag(html, /<html lang="[^"]*">/i, `<html lang="${meta.lang}">`);
  html = replaceTag(html, /<title>.*?<\/title>/i, `<title>${title}</title>`);
  html = replaceTag(html, /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
    `<meta name="description" content="${description}" />`);
  html = replaceTag(html, /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:title" content="${title}" />`);
  html = replaceTag(html, /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:description" content="${description}" />`);
  html = replaceTag(html, /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:url" content="${meta.canonical}" />`);
  html = replaceTag(html, /<meta\s+property="og:type"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:type" content="${meta.ogType}" />`);
  html = replaceTag(html, /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${title}" />`);
  html = replaceTag(html, /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${description}" />`);

  // og:locale for this language, the others as alternates
  const localeTags = [`<meta property="og:locale" content="${OG_LOCALES[meta.lang]}" />`]
    .concat(Object.entries(OG_LOCALES)
      .filter(([lang]) => lang !== meta.lang)
      .map(([, locale]) => `<meta property="og:locale:alternate" content="${locale}" />`))
    .join("\n    ");
  html = html.replace(/\s*<meta\s+property="og:locale:alternate"\s+content=".*?"\s*\/?>/gi, "");
  html = replaceTag(html, /<meta\s+property="og:locale"\s+content=".*?"\s*\/?>/i, localeTags);

  // Canonical URL plus every language version (hreflang) of the page
  const linkTags = [`<link rel="canonical" href="${meta.canonical}" />`]
    .concat((meta.alternates || []).map(
      ({ hreflang, href }) => `<link rel="alternate" hreflang="${hreflang}" href="${href}" />`
    ))
    .join("\n    ");
  html = replaceTag(html, /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i, linkTags);

  if (meta.noindex) {
    html = replaceTag(html, /<meta\s+name="robots"\s+content=".*?"\s*\/?>/i,
      `<meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />`);
  }

  const jsonLd = /<script type="application\/ld\+json">[\s\S]*?<\/script>/i;
  if (meta.schema) {
    // "<" escaped so the JSON can never close the <script> early
    const json = JSON.stringify(meta.schema, null, 2).replace(/</g, "\\u003c");
    html = replaceTag(html, jsonLd, `<script type="application/ld+json">\n${json}\n    </script>`);
  } else {
    html = html.replace(jsonLd, "");
  }

  // Real page markup inside #root. data-prerendered-path tells src/main.tsx it can reuse it.
  if (meta.appHtml) {
    html = replaceTag(html, /<div id="root"><\/div>/,
      `<div id="root" data-prerendered-path="${meta.path}">${meta.appHtml}</div>`);
  }

  return html;
}

function writePage(urlPath, html) {
  const outFile = path.join(distDir, ...urlPath.split("/").filter(Boolean), "index.html");
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html, "utf-8");
  console.log(`✓ ${path.relative(distDir, outFile)}`);
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

function buildSitemap(entries) {
  const lastmod = lastContentChange();
  const urls = entries.map(({ loc, alternates, images }) => {
    const links = alternates
      .map(({ hreflang, href }) => `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}"/>`)
      .join("\n");
    const imageTags = images
      .map((src) => `    <image:image><image:loc>${SITE}${src}</image:loc></image:image>`)
      .join("\n");
    return [`  <url>`, `    <loc>${loc}</loc>`, `    <lastmod>${lastmod}</lastmod>`, links, imageTags, `  </url>`]
      .filter(Boolean)
      .join("\n");
  });

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`,
    `        xmlns:xhtml="http://www.w3.org/1999/xhtml"`,
    `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`,
    ...urls,
    `</urlset>`,
    ``
  ].join("\n");
}

async function main() {
  const template = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");
  if (!fs.existsSync(serverEntry)) {
    throw new Error("dist-server/entry-server.mjs not found. Run the SSR build first.");
  }
  const { render, translate, languages, defaultLanguage, localizePath } = await import(
    pathToFileURL(serverEntry).href
  );
  const media = JSON.parse(fs.readFileSync(mediaManifest, "utf-8"));

  const sitemapEntries = [];
  console.log("Generating pages…");

  for (const page of PAGES) {
    const alternates = page.noindex
      ? []
      : languages
          .map((lang) => ({ hreflang: lang, href: SITE + localizePath(page.page, lang) }))
          .concat({ hreflang: "x-default", href: SITE + localizePath(page.page, defaultLanguage) });

    for (const lang of languages) {
      const urlPath = localizePath(page.page, lang);
      const url = SITE + urlPath;
      const title = await translate(lang, `seo_${page.key}_title`);
      const description = page.description ?? (await translate(lang, `seo_${page.key}_description`));

      writePage(urlPath, renderHead(template, {
        path: urlPath,
        lang,
        title,
        description,
        canonical: url,
        ogType: page.ogType,
        noindex: page.noindex,
        alternates,
        schema: page.schema ? page.schema({ url, lang, title, description }) : null,
        appHtml: page.prerender ? await render(urlPath) : ""
      }));

      if (!page.noindex) {
        const images = page.sitemapImages === "trips"
          ? TRIP_PHOTOS.map((name) => media.photos[name].src)
          : page.sitemapImages || [];
        sitemapEntries.push({ loc: url, alternates, images });
      }
    }
  }

  writePage(SECRET.path, renderHead(template, {
    path: SECRET.path,
    lang: defaultLanguage,
    title: SECRET.title,
    description: SECRET.description,
    canonical: SITE + SECRET.path,
    ogType: "website",
    noindex: true,
    schema: null
  }));

  fs.writeFileSync(path.join(distDir, "sitemap.xml"), buildSitemap(sitemapEntries), "utf-8");
  console.log(`✓ sitemap.xml (${sitemapEntries.length} URLs)`);
  console.log("Prerender & SEO build completed successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
