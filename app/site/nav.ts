import manifest from "../content/manifest.json";

export type GuideEntry = (typeof manifest)[number];

/** Resolve an in-site path against the deployment base (e.g. "/repo-name/"). */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}/${path.replace(/^\//, "")}`;
}

export const guide: GuideEntry[] = manifest;

/** Guide pages grouped into their reading clusters, order preserved. */
export const clusters: { name: string; pages: GuideEntry[] }[] = manifest.reduce(
  (acc, page) => {
    const last = acc[acc.length - 1];
    if (last && last.name === page.cluster) last.pages.push(page);
    else acc.push({ name: page.cluster, pages: [page] });
    return acc;
  },
  [] as { name: string; pages: GuideEntry[] }[],
);

export const PRIMARY = [
  { href: "", label: "Dashboard" },
  { href: "guide/", label: "Guide" },
  { href: "glossary/", label: "Glossary" },
  { href: "sources/", label: "Sources" },
];
