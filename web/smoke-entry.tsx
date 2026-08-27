/**
 * Renders every page component to a string so a runtime error in the tree
 * fails the build instead of shipping a blank page. Run via `npm run test:pages`.
 */
import { renderToString } from "react-dom/server";

import Dashboard from "../app/Dashboard";
import GlossaryPage from "../app/site/GlossaryPage";
import GuideIndex from "../app/site/GuideIndex";
import GuidePage from "../app/site/GuidePage";
import SourcesPage from "../app/site/SourcesPage";
import manifest from "../app/content/manifest.json";

const sections = import.meta.glob("../app/content/sections/*.json", { eager: true });

export function run(): { name: string; length: number; text: string }[] {
  const results = [
    { name: "/", el: <Dashboard /> },
    { name: "/guide/", el: <GuideIndex /> },
    { name: "/glossary/", el: <GlossaryPage /> },
    { name: "/sources/", el: <SourcesPage /> },
    ...manifest.map((m) => {
      const mod = sections[`../app/content/sections/${m.slug}.json`] as { default: unknown };
      return { name: `/guide/${m.slug}/`, el: <GuidePage section={mod.default as never} /> };
    }),
  ];
  return results.map(({ name, el }) => {
    const text = renderToString(el);
    return { name, length: text.length, text };
  });
}
