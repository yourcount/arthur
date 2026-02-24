"use client";

import { useEffect, useState } from "react";

type ThemeOption = {
  id: string;
  name: string;
  description: string;
  swatches: [string, string, string];
};

const themeOptions: ThemeOption[] = [
  {
    id: "default",
    name: "Stage Classic",
    description: "Heldere studio-look met warme accenten.",
    swatches: ["#0f172a", "#ff5a3d", "#06b6d4"],
  },
  {
    id: "electric-night",
    name: "Electric Night",
    description: "Donker podium met neon-energie.",
    swatches: ["#0b1020", "#14b8a6", "#f43f5e"],
  },
  {
    id: "copper-wood",
    name: "Copper Wood",
    description: "Natuurlijke cajon-tinten met koperaccent.",
    swatches: ["#2a1f1a", "#d97706", "#f59e0b"],
  },
  {
    id: "retro-sunburst",
    name: "Retro Sunburst",
    description: "Americana-vibe met sunburst contrast.",
    swatches: ["#1a1a1a", "#ef4444", "#f97316"],
  },
  {
    id: "mono-metal",
    name: "Mono Metal",
    description: "Zakelijk grijs met strakke metal-accenten.",
    swatches: ["#0f172a", "#64748b", "#22d3ee"],
  },
];

const storageKey = "arthur-theme";

function applyTheme(themeId: string) {
  const root = document.documentElement;
  root.dataset.theme = themeId;
}

export function ThemeControlPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState(() => {
    if (typeof window === "undefined") return "default";
    return window.localStorage.getItem(storageKey) ?? "default";
  });

  useEffect(() => {
    applyTheme(activeTheme);
  }, [activeTheme]);

  const onSelectTheme = (themeId: string) => {
    setActiveTheme(themeId);
    applyTheme(themeId);
    window.localStorage.setItem(storageKey, themeId);
  };

  return (
    <aside className="theme-panel" aria-label="Huisstijl wisselaar">
      <button
        type="button"
        className="theme-panel-toggle"
        onClick={() => setIsOpen((value) => !value)}
        aria-expanded={isOpen}
        aria-controls="theme-panel-body"
      >
        Huisstijl
      </button>

      <div id="theme-panel-body" className={`theme-panel-body ${isOpen ? "is-open" : ""}`}>
        <p className="theme-panel-title">Kies stijl</p>
        <div className="theme-panel-list">
          {themeOptions.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme.id)}
              className={`theme-preset ${activeTheme === theme.id ? "is-active" : ""}`}
              aria-pressed={activeTheme === theme.id}
            >
              <span className="theme-preset-head">
                <span>{theme.name}</span>
                <span className="theme-swatch-row" aria-hidden>
                  {theme.swatches.map((swatch) => (
                    <span key={swatch} className="theme-swatch" style={{ backgroundColor: swatch }} />
                  ))}
                </span>
              </span>
              <span className="theme-preset-description">{theme.description}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
