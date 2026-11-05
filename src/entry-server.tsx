// Build-time renderer used by scripts/prerender.js to put real page markup into the HTML.
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, initI18n, setActiveLanguage, t, type Language } from "./lib/i18n";

let ready: Promise<void> | undefined;

function ensureI18n(): Promise<void> {
  ready ??= initI18n();
  return ready;
}

/** Markup of the app at `url` (its language comes from the URL prefix). */
export async function render(url: string): Promise<string> {
  await ensureI18n();
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
}

/** Translated texts prerender.js needs for <head> (titles, descriptions…). */
export async function translate(lang: Language, key: string): Promise<string> {
  await ensureI18n();
  setActiveLanguage(lang);
  return t(key);
}

export const languages = SUPPORTED_LANGUAGES;
export const defaultLanguage = DEFAULT_LANGUAGE;
export { localizePath } from "./lib/paths";
