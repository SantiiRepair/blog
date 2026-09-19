import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { currentLanguage, initI18n } from "./lib/i18n";

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

  createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}

void bootstrap();
