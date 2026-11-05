// Logbook entries live in src/content/diary/<date>-<slug>.md, one file per entry:
//
//   ---
//   date: 2026-06-15
//   hidden: false
//   ---
//   ## es: maracaibo
//   texto…
//   ## en: maracaibo
//   text…
//
// A language missing from a file falls back to English. Only DiaryPage imports this module,
// so the texts are bundled with that page instead of the JS every page loads.

export type DiaryEntry = {
  slug: string;
  date: string;
  hidden: boolean;
  title: string;
  text: string;
};

type ParsedEntry = {
  slug: string;
  date: string;
  hidden: boolean;
  sections: Record<string, { title: string; text: string }>;
};

const files = import.meta.glob("../content/diary/*.md", {
  query: "?raw",
  import: "default",
  eager: true
}) as Record<string, string>;

const SECTION_HEADING = /^## ([a-z]{2}): (.*)$/gm;

function parseEntry(path: string, raw: string): ParsedEntry {
  const source = raw.replace(/\r\n/g, "\n");
  const fileName = path.split("/").pop() ?? path;
  const frontMatter = /^---\n([\s\S]*?)\n---\n/.exec(source);
  if (!frontMatter) {
    throw new Error(`Diary entry ${fileName} has no front matter`);
  }

  const meta: Record<string, string> = {};
  for (const line of frontMatter[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator > 0) {
      meta[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
    }
  }

  const body = source.slice(frontMatter[0].length);
  const headings = [...body.matchAll(SECTION_HEADING)];
  const sections: ParsedEntry["sections"] = {};
  headings.forEach((heading, index) => {
    const start = (heading.index ?? 0) + heading[0].length;
    const end = index + 1 < headings.length ? headings[index + 1].index : body.length;
    sections[heading[1]] = {
      title: heading[2].trim(),
      text: body.slice(start, end).replace(/^\n+|\n+$/g, "")
    };
  });

  return {
    // "2026-06-15-maracaibo.md" -> "maracaibo"
    slug: fileName.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, ""),
    date: meta.date,
    hidden: meta.hidden === "true",
    sections
  };
}

const entries = Object.entries(files)
  .map(([path, raw]) => parseEntry(path, raw))
  .sort((a, b) => b.date.localeCompare(a.date));

/** All entries, newest first, with texts in `lang` (English when missing). */
export function diaryEntries(lang: string): DiaryEntry[] {
  return entries.map((entry) => {
    const section = entry.sections[lang] ?? entry.sections.en ?? Object.values(entry.sections)[0];
    return {
      slug: entry.slug,
      date: entry.date,
      hidden: entry.hidden,
      title: section?.title ?? entry.slug,
      text: section?.text ?? ""
    };
  });
}
