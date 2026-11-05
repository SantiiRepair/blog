export const SECRET_PATH = "/nv";

export const KNOWN_PATHS = ["/", "/favorites", "/trips", "/diary", SECRET_PATH];

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
