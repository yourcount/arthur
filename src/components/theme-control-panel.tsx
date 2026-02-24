"use client";

import { useEffect, useState } from "react";

type ThemeOption = {
  id: string;
  name: string;
  description: string;
  swatches: [string, string, string];
  facets: {
    logo: string;
    typography: string;
    imagery: string;
    shapes: string;
    voice: string;
    components: string;
    motion: string;
  };
};

const themeOptions: ThemeOption[] = [
  {
    id: "default",
    name: "Stage Classic",
    description: "Heldere studio-look met warme accenten.",
    swatches: ["#0f172a", "#ff5a3d", "#06b6d4"],
    facets: {
      logo: "Badge met donkere basis en helder accent.",
      typography: "Sterke display-koppen, rustige body.",
      imagery: "Natuurlijke kleuren met lichte contrastboost.",
      shapes: "Ronde kaarten en zachte schaduwen.",
      voice: "Professioneel, direct en toegankelijk.",
      components: "Duidelijke primary CTA en rustige secundaire knoppen.",
      motion: "Subtiele reveals met korte easing.",
    },
  },
  {
    id: "electric-night",
    name: "Electric Night",
    description: "Donker podium met neon-energie.",
    swatches: ["#0b1020", "#14b8a6", "#f43f5e"],
    facets: {
      logo: "Licht logo op deep-night nav.",
      typography: "Display-koppen met strakkere tracking.",
      imagery: "Sterke saturatie en podiumcontrast.",
      shapes: "Glassy panel look en scherpere lijnen.",
      voice: "Zelfverzekerd en modern.",
      components: "Neon-accent op actieve states.",
      motion: "Sneller, ritmisch tempo.",
    },
  },
  {
    id: "copper-wood",
    name: "Copper Wood",
    description: "Natuurlijke cajon-tinten met koperaccent.",
    swatches: ["#2a1f1a", "#d97706", "#f59e0b"],
    facets: {
      logo: "Warme wood-badge met koperlijn.",
      typography: "Organische heading-spatiëring.",
      imagery: "Warmere tinten, minder koele tonen.",
      shapes: "Meer afgeronde elementen.",
      voice: "Menselijk, ambachtelijk en uitnodigend.",
      components: "Knoppen met warm contrast en zachte borders.",
      motion: "Rustig en vloeiend.",
    },
  },
  {
    id: "retro-sunburst",
    name: "Retro Sunburst",
    description: "Americana-vibe met sunburst contrast.",
    swatches: ["#1a1a1a", "#ef4444", "#f97316"],
    facets: {
      logo: "Contrasterend mark-logo met retro flair.",
      typography: "Compacte koppen met vintage spanning.",
      imagery: "Warme red/orange sunburst filtermix.",
      shapes: "Duidelijke sectieovergangen en stevige borders.",
      voice: "Karaktervol maar helder.",
      components: "Hogere CTA-contrast voor boekingen.",
      motion: "Middentempo met nadruk op hoofdstukwissels.",
    },
  },
  {
    id: "mono-metal",
    name: "Mono Metal",
    description: "Zakelijk grijs met strakke metal-accenten.",
    swatches: ["#0f172a", "#64748b", "#22d3ee"],
    facets: {
      logo: "Minimal mark met technische uitstraling.",
      typography: "Functionele hiërarchie, hoge leesbaarheid.",
      imagery: "Koelere toning met strakke scherpte.",
      shapes: "Strakke hoeken en compactere componenten.",
      voice: "Nuchter, professioneel en to-the-point.",
      components: "Utility-first knoppen en duidelijke states.",
      motion: "Beperkte beweging, performance-first.",
    },
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
        <div className="theme-facet-box">
          <p className="theme-facet-title">Actieve huisstijl</p>
          {(() => {
            const activeThemeData = themeOptions.find((theme) => theme.id === activeTheme) ?? themeOptions[0];
            return (
              <ul className="theme-facet-list">
                <li>
                  <strong>Logo:</strong> {activeThemeData.facets.logo}
                </li>
                <li>
                  <strong>Typografie:</strong> {activeThemeData.facets.typography}
                </li>
                <li>
                  <strong>Beeldtaal:</strong> {activeThemeData.facets.imagery}
                </li>
                <li>
                  <strong>Vormtaal:</strong> {activeThemeData.facets.shapes}
                </li>
                <li>
                  <strong>Tone:</strong> {activeThemeData.facets.voice}
                </li>
                <li>
                  <strong>Componenten:</strong> {activeThemeData.facets.components}
                </li>
                <li>
                  <strong>Motion:</strong> {activeThemeData.facets.motion}
                </li>
              </ul>
            );
          })()}
        </div>
      </div>
    </aside>
  );
}
