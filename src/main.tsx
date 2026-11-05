import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { initI18n } from "./lib/i18n";
import { normalizePath } from "./lib/paths";

// Seamless migration for legacy bookmarks with hash URLs (e.g. /#/diary -> /diary)
if (window.location.hash.startsWith("#/")) {
  const cleanPath = window.location.hash.slice(1);
  window.history.replaceState(null, "", cleanPath);
}

async function bootstrap(): Promise<void> {
  await initI18n();

  const rootElement = document.getElementById("root");
  if (!rootElement) {
    return;
  }

  const app = (
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );

  // scripts/prerender.js puts each page's markup into its HTML at build time (one file per
  // language). The language comes from the URL, so when the file matches the current URL
  // React reuses that markup; otherwise (e.g. the SPA fallback for an unknown URL) it renders.
  const prerenderedPath = rootElement.dataset.prerenderedPath;
  const canHydrate =
    prerenderedPath !== undefined &&
    normalizePath(prerenderedPath) === normalizePath(window.location.pathname);

  if (canHydrate) {
    hydrateRoot(rootElement, app);
  } else {
    createRoot(rootElement).render(app);
  }
}

void bootstrap();
