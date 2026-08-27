import type { ReactNode } from "react";

import { PRIMARY, url } from "./nav";

/** Shared header and footer for every page except the dashboard landing view. */
export default function Chrome({ active, children }: { active: string; children: ReactNode }) {
  return (
    <>
      <header className="topbar">
        <a className="brand" href={url("")}>
          <span className="brand-mark">O</span>
          <span>Open Compute Markets</span>
        </a>
        <nav aria-label="Primary navigation">
          {PRIMARY.map((item) => (
            <a
              key={item.href}
              href={url(item.href)}
              className={item.href === active ? "active" : undefined}
              aria-current={item.href === active ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a className="contribute" href={url("guide/")}>
          Start the guide <span>↗</span>
        </a>
      </header>
      {children}
      <footer className="site-footer">
        <div className="brand">
          <span className="brand-mark">O</span>
          <span>Open Compute Markets Observatory</span>
        </div>
        <p>Public research infrastructure. Not investment advice.</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </>
  );
}
