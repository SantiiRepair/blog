// Build-time renderer used by scripts/prerender.js to put real page markup into the HTML.
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import { PRERENDER_LANGUAGE, initI18n } from "./lib/i18n";

let ready: Promise<void> | undefined;

export async function render(url: string): Promise<string> {
  ready ??= initI18n(PRERENDER_LANGUAGE);
  await ready;

  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );
}
