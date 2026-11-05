import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, isSupported, type Language } from "./i18n";

export const SECRET_PATH = "/nv";

// Pages that exist in every language ("/" is the home page).
export const PAGES = ["/", "/favorites", "/trips", "/diary"] as const;
export type Page = (typeof PAGES)[number];

export function normalizePath(path: string): string {
  const pathWithoutQuery = path.split("?")[0];
  const pathWithoutHash = pathWithoutQuery.split("#")[0];

  if (!pathWithoutHash) {
    return "/";
  }

  const withLeadingSlash = pathWithoutHash.startsWith("/")
    ? pathWithoutHash
    : `/${pathWithoutHash}`;

  if (withLeadingSlash === "/") {
    return withLeadingSlash;
  }

  return withLeadingSlash.replace(/\/+$/, "");
}

/** "/en/trips" -> "en", "/trips" -> "es" (Spanish has no prefix). */
export function languageFromPath(path: string): Language {
  const firstSegment = normalizePath(path).split("/")[1];
  return isSupported(firstSegment) && firstSegment !== DEFAULT_LANGUAGE
    ? firstSegment
    : DEFAULT_LANGUAGE;
}

/** Path without its language prefix: "/en/trips/" -> "/trips", "/en" -> "/". */
export function pagePath(path: string): string {
  const normalized = normalizePath(path);
  const lang = languageFromPath(normalized);
  if (lang === DEFAULT_LANGUAGE) {
    return normalized;
  }
  return normalizePath(normalized.slice(lang.length + 1));
}

export function isKnownPage(page: string): page is Page {
  return (PAGES as readonly string[]).includes(page);
}

/**
 * Public URL path of a page in a language, always with a trailing slash
 * (GitHub Pages answers "/trips" with a redirect to "/trips/").
 */
export function localizePath(page: string, lang: Language): string {
  const prefix = lang === DEFAULT_LANGUAGE ? "" : `/${lang}`;
  const pageWithSlash = page === "/" ? "/" : `${normalizePath(page)}/`;
  return `${prefix}${pageWithSlash}`;
}

export function languagePrefixes(): string[] {
  return SUPPORTED_LANGUAGES.map((lang) => (lang === DEFAULT_LANGUAGE ? "" : `/${lang}`));
}
