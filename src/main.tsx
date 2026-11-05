import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { PRERENDER_LANGUAGE, currentLanguage, initI18n } from "./lib/i18n";
import { normalizePath } from "./lib/paths";

// Seamless migration for legacy bookmarks with hash URLs (e.g. /#/diary -> /diary)
if (window.location.hash.startsWith("#/")) {
  const cleanPath = window.location.hash.slice(1);
  window.history.replaceState(null, "", cleanPath);
}

async function bootstrap(): Promise<void> {
  await initI18n();
  document.documentElement.lang = currentLanguage();

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

  // scripts/prerender.js renders some pages into the HTML at build time (in Spanish).
  // Reuse that markup when it matches what this visitor would see; otherwise render from scratch.
  const prerenderedPath = rootElement.dataset.prerenderedPath;
  const canHydrate =
    prerenderedPath !== undefined &&
    prerenderedPath === normalizePath(window.location.pathname) &&
    currentLanguage() === PRERENDER_LANGUAGE;

  if (canHydrate) {
    hydrateRoot(rootElement, app);
  } else {
    createRoot(rootElement).render(app);
  }
}

void bootstrap();
