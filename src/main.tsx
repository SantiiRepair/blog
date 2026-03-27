import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { currentLanguage, initI18n } from "./lib/i18n";
import "../css/style.css";

async function bootstrap(): Promise<void> {
  await initI18n();
  document.documentElement.lang = currentLanguage();

  const rootElement = document.getElementById("root");
  if (!rootElement) {
    return;
  }

  createRoot(rootElement).render(
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </React.StrictMode>
  );
}

void bootstrap();
