"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ContactForm } from "@/components/contact-form";
import { DiscographyCard } from "@/components/discography-card";
import { ExpandableList } from "@/components/expandable-list";
import { ThemeControlPanel } from "@/components/theme-control-panel";
import { TopNav } from "@/components/top-nav";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { SectionShell } from "@/components/ui/section-shell";
import { content } from "@/lib/content";
import type { LessonBlock, SectionId } from "@/types/content";

const sectionOrder: Array<{ id: SectionId; label: string }> = [
  { id: "home", label: "Home" },
  { id: "bio", label: "Bio" },
  { id: "milk", label: "Milk 2.0" },
  { id: "discografie", label: "Discografie" },
  { id: "dvd", label: "DVD" },
  { id: "gigs", label: "Gigs/Studio" },
  { id: "optredens", label: "Optredens" },
  { id: "lessen", label: "Lessen" },
  { id: "contact", label: "Contact" },
];

const bioTimeline = [
  { period: "1991-1999", label: "Louisiana Radio", detail: "Festivals en clubcircuit in binnen- en buitenland." },
  { period: "Daarna", label: "Internationale tours", detail: "Blues, rock en singer-songwriter in meer dan 30 landen." },
  { period: "Nu", label: "Live, studio en theater", detail: "Inzetbaar voor producties, shows en educatie." },
];

const referenceHighlights = [
  {
    id: "ref-live",
    quote: "Voorstellingen met onder meer Holland America Lijn, De Andersons en Sjors van der Panne.",
    source: "Theatertournees",
  },
  {
    id: "ref-studio",
    quote: "Opnames op drums, cajon en percussie voor singles, EPs, albums en dvd-producties.",
    source: "Studio releases",
  },
  {
    id: "ref-international",
    quote: "Tours en optredens in Europa, Verenigde Staten, Afrika en Canada.",
    source: "Internationale ervaring",
  },
];

const credibilityLinks = [
  {
    id: "cred-milk",
    label: "Milk 2.0 project",
    description: "Eigen project en artistieke signatuur.",
    href: content.projectCards[0]?.link,
  },
  {
    id: "cred-lesson",
    label: "Drummersplace",
    description: "Lessen en educatieve context.",
    href: content.lessonBlocks[0]?.externalLink,
  },
  {
    id: "cred-release",
    label: "Recente release",
    description: "Beluister geselecteerd werk.",
    href: content.discographyItems.find((item) => item.platformUrl)?.platformUrl,
  },
].filter((item): item is { id: string; label: string; description: string; href: string } => Boolean(item.href));

function getYoutubeVideoId(videoUrl: string) {
  const match = videoUrl.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}

function getYoutubeThumbnail(videoUrl: string) {
  const id = getYoutubeVideoId(videoUrl);
  return id ? `https://i.ytimg.com/vi/${id}/mqdefault.jpg` : null;
}

const lessonLabel: Record<LessonBlock["lessonType"], string> = {
  drum: "Drumlessen",
  cajon: "Cajonlessen",
  workshop: "Workshops",
};

export default function HomePage() {
  const bioBlocks = content.richTextBlocks.filter((block) => block.sectionId === "bio");
  const gigsBlock = content.richTextBlocks.find((block) => block.sectionId === "gigs");
  const milkStory = content.richTextBlocks.find((block) => block.sectionId === "milk");
  const milkProject = content.projectCards[0];
  const collabList = content.expandableLists.find((list) => list.sectionId === "bio");

  const [featuredVideoIndex, setFeaturedVideoIndex] = useState(0);
  const [discTypeFilter, setDiscTypeFilter] = useState<string>("all");
  const [discYearFilter, setDiscYearFilter] = useState<string>("all");
  const [discView, setDiscView] = useState<"releases" | "videos" | "partners">("releases");
  const [gigsMode, setGigsMode] = useState<"live" | "studio">("live");
  const [showsMode, setShowsMode] = useState<"upcoming" | "archive">("upcoming");
  const [openLessonId, setOpenLessonId] = useState<string>(content.lessonBlocks[0]?.id ?? "");
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const [isLiteMode, setIsLiteMode] = useState(false);
  const [showAllMedia, setShowAllMedia] = useState(false);
  const [showAllReleases, setShowAllReleases] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
        .connection as
        | { saveData?: boolean; effectiveType?: string }
        | undefined;
      const isSlowNetwork = Boolean(connection?.saveData) || /2g|3g/.test(connection?.effectiveType ?? "");
      const isLowCpu = navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4;
      setIsLiteMode(isSlowNetwork || isLowCpu);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.performanceMode = isLiteMode ? "lite" : "default";
    return () => {
      delete document.documentElement.dataset.performanceMode;
    };
  }, [isLiteMode]);

  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>(".reveal-item"));
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [discView, showAllMedia, showAllReleases]);

  const visibleMediaCount = showAllMedia ? content.mediaItems.length : isLiteMode ? 3 : 6;

  const discTypes = useMemo(
    () => ["all", ...Array.from(new Set(content.discographyItems.map((item) => item.releaseType)))],
    [],
  );

  const discYears = useMemo(
    () => ["all", ...Array.from(new Set(content.discographyItems.map((item) => String(item.year)))).sort((a, b) => Number(b) - Number(a))],
    [],
  );

  const filteredDiscography = useMemo(() => {
    return content.discographyItems
      .filter((item) => (discTypeFilter === "all" ? true : item.releaseType === discTypeFilter))
      .filter((item) => (discYearFilter === "all" ? true : String(item.year) === discYearFilter))
      .slice()
      .sort((a, b) => b.year - a.year);
  }, [discTypeFilter, discYearFilter]);

  const hasActiveDiscFilters = discTypeFilter !== "all" || discYearFilter !== "all";
  const shouldShowAllDiscography = showAllReleases || hasActiveDiscFilters;
  const visibleDiscography = useMemo(
    () => (shouldShowAllDiscography ? filteredDiscography : filteredDiscography.slice(0, 3)),
    [filteredDiscography, shouldShowAllDiscography],
  );

  const galleryVideos = useMemo(
    () =>
      content.mediaItems
        .map((media) => {
          const videoId = getYoutubeVideoId(media.videoUrl);
          if (!videoId) return null;
          return { title: media.title, videoId, videoUrl: media.videoUrl };
        })
        .filter((item): item is { title: string; videoId: string; videoUrl: string } => item !== null),
    [],
  );

  const displayedVideos = useMemo(() => galleryVideos.slice(0, visibleMediaCount), [galleryVideos, visibleMediaCount]);
  const safeFeaturedVideoIndex =
    displayedVideos.length === 0 ? 0 : Math.min(featuredVideoIndex, displayedVideos.length - 1);

  const gigsDetails: Record<typeof gigsMode, string[]> = {
    live: [
      "Boekbaar voor concerten, festivals en theatervoorstellingen.",
      "Focus op strak samenspel, dynamiek en muzikale ondersteuning van de act.",
    ],
    studio: [
      "Inspelen van drum- en percussiepartijen voor producties en releases.",
      "Levering als complete takes of losse tracks in overleg.",
    ],
  };

  const gigsVisuals = useMemo(() => {
    const liveThumb = getYoutubeThumbnail(content.mediaItems[0]?.videoUrl ?? "");
    const studioThumb = getYoutubeThumbnail(content.mediaItems[1]?.videoUrl ?? "");
    return {
      live: {
        src: liveThumb ?? content.heroMedia.imageSrc,
        alt: "Live setup van Arthur Bont",
        caption: "Live context: podiumdynamiek en samenspel.",
      },
      studio: {
        src: studioThumb ?? content.heroMedia.imageSrc,
        alt: "Studio context van Arthur Bont",
        caption: "Studio context: strakke takes en productiegericht spel.",
      },
    } as const;
  }, []);

  const onCopyPayment = async () => {
    try {
      await navigator.clipboard.writeText(content.productInfo.paymentDetails);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("idle");
    }
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2"
      >
        Ga naar inhoud
      </a>
      <TopNav items={sectionOrder} />
      <ThemeControlPanel />

      <main id="main-content">
        <section
          id="home"
          aria-labelledby="home-title"
          className="themed-section hero-section border-b border-[var(--line)] pt-0 pb-24 sm:pt-0 sm:pb-24"
        >
          <div className="hero-stage w-full px-4 py-5 sm:px-6 sm:py-8 md:px-8 md:py-10">
            <div className="mx-auto grid min-h-[70svh] w-[min(1200px,100%)] gap-8 md:min-h-[calc(100svh-88px)] md:grid-cols-[1.1fr_.9fr] md:items-center md:gap-16">
              <figure
                className={`hero-media-shell ${content.heroMedia.videoSrc && !isLiteMode ? "hero-has-video" : ""} order-1 aspect-square overflow-hidden`}
              >
                {content.heroMedia.videoSrc && !isLiteMode ? (
                  <video
                    className="hero-media-video h-full w-full rounded-xl border border-[var(--line)] object-cover object-top"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    poster={content.heroMedia.posterSrc}
                    aria-label={content.heroMedia.imageAlt}
                  >
                    <source src={content.heroMedia.videoSrc} type="video/mp4" />
                  </video>
                ) : null}
                <Image
                  src={content.heroMedia.imageSrc}
                  alt={content.heroMedia.imageAlt}
                  width={1200}
                  height={720}
                  priority
                  className="hero-media-image h-full w-full rounded-xl border border-[var(--line)] object-cover object-top"
                />
              </figure>

              <article className="order-2 home-copy-reveal flex flex-col justify-center gap-6 text-white md:gap-8 md:pr-6">
                <div className="flex flex-wrap gap-2" aria-label="Specialisaties">
                  <span className="chip">Drummer</span>
                  <span className="chip">Percussionist</span>
                  <span className="chip">Cajon specialist</span>
                </div>
                <h1 id="home-title" className="text-5xl leading-none font-semibold tracking-wide sm:text-7xl lg:text-8xl">
                  {content.sectionHeaders.home.title}
                </h1>
                <p className="max-w-2xl text-lg text-white/85">{content.sectionHeaders.home.intro}</p>
                <div className="mb-8 flex flex-wrap gap-3 sm:mb-0">
                  <ButtonLink href="#gigs" variant="primary">
                    Boek Arthur voor Live/Studio
                  </ButtonLink>
                  <ButtonLink href="#discografie" variant="inverted">
                    Bekijk recente releases
                  </ButtonLink>
                  <ButtonLink href="#contact" variant="inverted">
                    Neem direct contact op
                  </ButtonLink>
                </div>
                <ul className="grid gap-2 text-sm text-white/80 sm:grid-cols-3" aria-label="Kernkwaliteiten">
                  <li className="flex items-center gap-2">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--cymbal)]" />
                    <span>Timing en groove</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--metal)]" />
                    <span>Dynamiek en samenspel</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    <span>Live, studio en educatie</span>
                  </li>
                </ul>
              </article>
            </div>
          </div>

          <div className="mx-auto mt-12 sm:mt-16 lg:mt-20 w-[min(1200px,calc(100%-2rem))]">
            <Card>
              <h2 className="text-2xl font-semibold">Highlights</h2>
              <ul className="cadence-group mt-5 grid gap-4 sm:gap-5 md:grid-cols-3 lg:gap-6">
                {content.highlightItems.map((highlight) => (
                  <li key={highlight.id} className="reveal-item rounded-lg border border-[var(--line)] bg-white p-3">
                    <p className="text-sm font-semibold">{highlight.label}</p>
                    <p className="text-sm text-[var(--muted)]">{highlight.description}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">{highlight.period}</p>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="mt-5">
              <h3 className="text-xl font-semibold">Referenties uit het werk</h3>
              <ul className="cadence-group mt-4 grid gap-4 md:grid-cols-3">
                {referenceHighlights.map((item) => (
                  <li key={item.id} className="reveal-item rounded-lg border border-[var(--line)] bg-white p-4">
                    <p className="text-sm leading-relaxed">&quot;{item.quote}&quot;</p>
                    <p className="mt-2 text-xs font-semibold tracking-wide text-[var(--muted)] uppercase">
                      Bron: {item.source}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
            {credibilityLinks.length > 0 ? (
              <Card className="mt-5">
                <h3 className="text-xl font-semibold">Uitgelichte projecten en releases</h3>
                <ul className="cadence-group mt-4 grid gap-3 md:grid-cols-3">
                  {credibilityLinks.map((item) => (
                    <li key={item.id} className="reveal-item rounded-lg border border-[var(--line)] bg-white p-4">
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">{item.description}</p>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm font-semibold text-[var(--wood-dark)] underline underline-offset-4"
                      >
                        Bekijk
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            ) : null}
          </div>

        </section>

        <SectionShell
          id="bio"
          title={content.sectionHeaders.bio.title}
          intro={content.sectionHeaders.bio.intro}
          alternating
          className="context-live"
        >
          <Card className="mb-6">
            <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr]">
              <figure className="overflow-hidden rounded-xl border border-[var(--line)] bg-white">
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={content.heroMedia.imageSrc}
                    alt="Portret van Arthur Bont tijdens een optreden"
                    fill
                    sizes="(max-width: 1024px) 100vw, 30vw"
                    className="object-cover object-top"
                  />
                </div>
                <figcaption className="media-caption">Arthur Bont live op drums.</figcaption>
              </figure>
              <div>
                <h3 className="text-xl font-semibold">Carriere in vogelvlucht</h3>
                <ol className="bio-timeline mt-4" aria-label="Carriere tijdlijn">
                  {bioTimeline.map((item) => (
                    <li key={`${item.period}-${item.label}`} className="bio-timeline-item">
                      <p className="text-xs font-semibold tracking-wide text-[var(--muted)] uppercase">{item.period}</p>
                      <p className="mt-1 font-semibold">{item.label}</p>
                      <p className="text-sm text-[var(--muted)]">{item.detail}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Card>
          <div className="cadence-group grid gap-8 lg:grid-cols-2">
            {bioBlocks.map((block) => (
              <Card key={block.id}>
                <h3 className="text-2xl font-semibold">{block.heading}</h3>
                {block.body.map((paragraph) => (
                  <p key={paragraph} className="mt-3 text-[var(--muted)]">
                    {paragraph}
                  </p>
                ))}
              </Card>
            ))}
          </div>
          {collabList ? (
            <div className="mt-8">
              <ExpandableList list={collabList} />
            </div>
          ) : null}
        </SectionShell>

        <SectionShell id="milk" title={content.sectionHeaders.milk.title} intro={content.sectionHeaders.milk.intro}>
          <Card>
            <h3 className="text-2xl font-semibold">{milkProject.projectName}</h3>
            <p className="mt-4 text-[var(--muted)]">{milkProject.shortDescription}</p>
            {milkStory ? (
              <details className="mt-6">
                <summary className="cursor-pointer font-semibold text-[var(--wood-dark)]">Lees projectverhaal</summary>
                {milkStory.body.map((paragraph) => (
                  <p key={paragraph} className="mt-2 text-[var(--muted)]">
                    {paragraph}
                  </p>
                ))}
              </details>
            ) : null}
            <h4 className="mt-6 text-lg font-semibold">Bezetting</h4>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {milkProject.lineup.map((member) => (
                <li key={member} className="rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm">
                  {member}
                </li>
              ))}
            </ul>
            {milkProject.link ? (
              <div className="mt-6">
                <ButtonLink href={milkProject.link} newTab>
                  Bezoek projectwebsite
                </ButtonLink>
              </div>
            ) : null}
          </Card>
        </SectionShell>

        <SectionShell
          id="discografie"
          title={content.sectionHeaders.discografie.title}
          intro={content.sectionHeaders.discografie.intro}
          alternating
          className="context-studio"
        >
          <Card className="mb-6">
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setDiscView("releases")}
                className={`rounded-md border px-3 py-1.5 text-sm font-semibold ${
                  discView === "releases"
                    ? "border-[var(--wood-dark)] bg-white text-[var(--text)]"
                    : "border-[var(--line)] bg-[var(--surface)] text-[var(--text)]"
                }`}
              >
                Releases
              </button>
              <button
                type="button"
                onClick={() => setDiscView("videos")}
                className={`rounded-md border px-3 py-1.5 text-sm font-semibold ${
                  discView === "videos"
                    ? "border-[var(--wood-dark)] bg-white text-[var(--text)]"
                    : "border-[var(--line)] bg-[var(--surface)] text-[var(--text)]"
                }`}
              >
                Video Gallery
              </button>
              <button
                type="button"
                onClick={() => setDiscView("partners")}
                className={`rounded-md border px-3 py-1.5 text-sm font-semibold ${
                  discView === "partners"
                    ? "border-[var(--wood-dark)] bg-white text-[var(--text)]"
                    : "border-[var(--line)] bg-[var(--surface)] text-[var(--text)]"
                }`}
              >
                Partners
              </button>
            </div>

            {discView === "releases" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1 text-sm font-medium" htmlFor="disc-type-filter">
                  Filter op type
                  <select
                    id="disc-type-filter"
                    value={discTypeFilter}
                    onChange={(event) => setDiscTypeFilter(event.target.value)}
                    className="rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-[var(--text)]"
                  >
                    {discTypes.map((type) => (
                      <option key={type} value={type}>
                        {type === "all" ? "Alle types" : type}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1 text-sm font-medium" htmlFor="disc-year-filter">
                  Filter op jaar
                  <select
                    id="disc-year-filter"
                    value={discYearFilter}
                    onChange={(event) => setDiscYearFilter(event.target.value)}
                    className="rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-[var(--text)]"
                  >
                    {discYears.map((year) => (
                      <option key={year} value={year}>
                        {year === "all" ? "Alle jaren" : year}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ) : null}
          </Card>

          {discView === "releases" ? (
            <>
              <p className="mb-2 text-xs font-semibold tracking-wide text-[var(--muted)] uppercase">Recente releases</p>
              <p className="mb-4 text-sm text-[var(--muted)]">
                Eerst de recente highlights, daarna kun je de volledige selectie openen.
              </p>
              <div className="cadence-group grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleDiscography.map((item) => (
                  <DiscographyCard key={item.id} item={item} />
                ))}
              </div>
              {filteredDiscography.length > 3 && !hasActiveDiscFilters ? (
                <button
                  type="button"
                  onClick={() => setShowAllReleases((value) => !value)}
                  className="mt-5 rounded-lg border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text)]"
                >
                  {showAllReleases ? "Toon minder releases" : "Toon volledige discografie"}
                </button>
              ) : null}
            </>
          ) : null}

          {discView === "videos" ? (
            <div>
              {isLiteMode ? (
                <p className="mb-4 text-sm text-[var(--muted)]">
                  Lite-modus actief: lichtere weergave voor betere performance.
                </p>
              ) : null}
              {displayedVideos.length > 0 ? (
                <div className="grid gap-5">
                  <article className="video-gallery-card reveal-item overflow-hidden rounded-xl border border-[var(--line)] bg-white">
                    {!isLiteMode ? (
                      <div className="video-gallery-hitarea block w-full text-left">
                        <div className="aspect-video w-full">
                          <iframe
                            className="h-full w-full"
                            src={`https://www.youtube.com/embed/${displayedVideos[safeFeaturedVideoIndex].videoId}`}
                            title={displayedVideos[safeFeaturedVideoIndex].title}
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                          />
                        </div>
                        <div className="p-4 sm:p-5">
                          <h3 className="text-xl font-semibold">{displayedVideos[safeFeaturedVideoIndex].title}</h3>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="aspect-video w-full overflow-hidden rounded-lg">
                          {getYoutubeThumbnail(displayedVideos[safeFeaturedVideoIndex].videoUrl) ? (
                            <Image
                              src={getYoutubeThumbnail(displayedVideos[safeFeaturedVideoIndex].videoUrl) ?? ""}
                              alt={`Thumbnail van video: ${displayedVideos[safeFeaturedVideoIndex].title}`}
                              width={1200}
                              height={675}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="p-4 sm:p-5">
                          <h3 className="text-xl font-semibold">{displayedVideos[safeFeaturedVideoIndex].title}</h3>
                          <a
                            href={displayedVideos[safeFeaturedVideoIndex].videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block text-sm text-[var(--wood-dark)] underline underline-offset-4"
                          >
                            Open video
                          </a>
                        </div>
                      </div>
                    )}
                  </article>

                  <div className="reveal-item overflow-x-auto pb-2">
                    <div className="flex min-w-max gap-3">
                      {displayedVideos.map((media, index) => (
                        <button
                          key={`${media.videoId}-thumb-${index}`}
                          type="button"
                          onClick={() => setFeaturedVideoIndex(index)}
                          className={`video-thumb-card text-left ${
                            featuredVideoIndex === index ? "is-active" : ""
                          }`}
                          aria-label={`Kies video: ${media.title}`}
                        >
                          {getYoutubeThumbnail(media.videoUrl) ? (
                            <div className="relative aspect-video w-full">
                              <Image
                                src={getYoutubeThumbnail(media.videoUrl) ?? ""}
                                alt={`Thumbnail van video: ${media.title}`}
                                fill
                                sizes="(max-width: 640px) 200px, 240px"
                                className="rounded-lg object-cover"
                              />
                            </div>
                          ) : null}
                          <p className="video-thumb-title mt-2 text-sm font-semibold">{media.title}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
              {visibleMediaCount < content.mediaItems.length ? (
                <button
                  type="button"
                  onClick={() => setShowAllMedia(true)}
                  className="mt-4 rounded-lg border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text)]"
                >
                  Toon alle media
                </button>
              ) : null}
            </div>
          ) : null}

          {discView === "partners" ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Partnerlinks">
              {content.partnerLogos.map((partner) => (
                <li key={partner.id}>
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="logo-accent reveal-item block rounded-xl border border-[var(--line)] bg-white p-5 font-medium text-[var(--text)] hover:bg-[var(--bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                    aria-label={partner.logoAlt}
                  >
                    {partner.name}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </SectionShell>

        <SectionShell id="dvd" title={content.sectionHeaders.dvd.title} intro={content.sectionHeaders.dvd.intro}>
          <Card>
            <p className="text-[var(--muted)]">{content.productInfo.summary}</p>
            <h3 className="mt-6 text-2xl font-semibold">Inhoud</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              {content.productInfo.contentPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <h3 className="mt-6 text-2xl font-semibold">Bestellen</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5">
              {content.productInfo.orderSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="mt-3 text-sm text-[var(--muted)]">Prijs: {content.productInfo.price}</p>
            <p className="text-sm text-[var(--muted)]">Betaling: {content.productInfo.paymentDetails}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={`mailto:${content.productInfo.contactEmail}`} variant="primary">
                Bestel via e-mail
              </ButtonLink>
              <button
                type="button"
                onClick={onCopyPayment}
                className="rounded-lg border border-[var(--line)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--text)] hover:bg-[var(--bg)]"
              >
                {copyState === "copied" ? "Betaalgegevens gekopieerd" : "Kopieer betaalgegevens"}
              </button>
            </div>
          </Card>
        </SectionShell>

        <SectionShell
          id="gigs"
          title={content.sectionHeaders.gigs.title}
          intro={content.sectionHeaders.gigs.intro}
          alternating
          className={gigsMode === "live" ? "context-live" : "context-studio"}
        >
          <Card>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setGigsMode("live")}
                className={`rounded-md border px-3 py-1.5 text-sm font-semibold ${
                  gigsMode === "live"
                    ? "border-[var(--wood-dark)] bg-white text-[var(--text)]"
                    : "border-[var(--line)] bg-[var(--surface)] text-[var(--text)]"
                }`}
              >
                Live
              </button>
              <button
                type="button"
                onClick={() => setGigsMode("studio")}
                className={`rounded-md border px-3 py-1.5 text-sm font-semibold ${
                  gigsMode === "studio"
                    ? "border-[var(--wood-dark)] bg-white text-[var(--text)]"
                    : "border-[var(--line)] bg-[var(--surface)] text-[var(--text)]"
                }`}
              >
                Studio
              </button>
            </div>
            <figure className="mx-auto mt-5 max-w-3xl overflow-hidden rounded-xl border border-[var(--line)] bg-white">
              <div className="relative aspect-[16/7] w-full">
                <Image
                  src={gigsVisuals[gigsMode].src}
                  alt={gigsVisuals[gigsMode].alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 700px"
                  className="object-cover object-center"
                />
              </div>
              <figcaption className="media-caption">{gigsVisuals[gigsMode].caption}</figcaption>
            </figure>
            <ul className="mt-6 space-y-3">
              {gigsDetails[gigsMode].map((line) => (
                <li key={line} className="text-[var(--muted)]">
                  {line}
                </li>
              ))}
            </ul>
            {gigsBlock ? (
              <div className="mt-6 border-t border-[var(--line)] pt-6">
                <h3 className="text-xl font-semibold">{gigsBlock.heading}</h3>
                {gigsBlock.body.map((paragraph) => (
                  <p key={paragraph} className="mt-2 text-[var(--muted)]">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}
            <div className="mt-6">
              <ButtonLink href="#contact" variant="primary">
                Start je boekingsaanvraag
              </ButtonLink>
            </div>
          </Card>
        </SectionShell>

        <SectionShell
          id="optredens"
          title={content.sectionHeaders.optredens.title}
          intro={content.sectionHeaders.optredens.intro}
        >
          <Card>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowsMode("upcoming")}
                className={`rounded-md border px-3 py-1.5 text-sm font-semibold ${
                  showsMode === "upcoming"
                    ? "border-[var(--wood-dark)] bg-white text-[var(--text)]"
                    : "border-[var(--line)] bg-[var(--surface)] text-[var(--text)]"
                }`}
              >
                Aankomend
              </button>
              <button
                type="button"
                onClick={() => setShowsMode("archive")}
                className={`rounded-md border px-3 py-1.5 text-sm font-semibold ${
                  showsMode === "archive"
                    ? "border-[var(--wood-dark)] bg-white text-[var(--text)]"
                    : "border-[var(--line)] bg-[var(--surface)] text-[var(--text)]"
                }`}
              >
                Archief
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {(showsMode === "upcoming" ? content.upcomingShows : content.archiveShows).map((show) => (
                <article key={show.id} className="rounded-lg border border-[var(--line)] bg-white p-4">
                  <p className="text-xs font-semibold tracking-wide text-[var(--muted)] uppercase">{show.period}</p>
                  <h3 className="mt-2 text-xl font-semibold">{show.title}</h3>
                  <p className="mt-1 text-sm text-[var(--muted)]">{show.context}</p>
                  {show.location ? <p className="mt-1 text-sm text-[var(--muted)]">{show.location}</p> : null}
                </article>
              ))}
            </div>
          </Card>
        </SectionShell>

        <SectionShell
          id="lessen"
          title={content.sectionHeaders.lessen.title}
          intro={content.sectionHeaders.lessen.intro}
          className="context-education"
        >
          <Card className="mb-5">
            <h3 className="text-xl font-semibold">Wat wil je leren?</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Kies hieronder je focus. Het juiste lesblok opent direct met praktische informatie.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {content.lessonBlocks.map((lesson) => (
                <button
                  key={`lesson-choice-${lesson.id}`}
                  type="button"
                  onClick={() => setOpenLessonId(lesson.id)}
                  className={`rounded-md border px-3 py-2 text-sm font-semibold ${
                    openLessonId === lesson.id
                      ? "border-[var(--wood-dark)] bg-white text-[var(--text)]"
                      : "border-[var(--line)] bg-[var(--surface)] text-[var(--text)]"
                  }`}
                >
                  {lessonLabel[lesson.lessonType]}
                </button>
              ))}
            </div>
          </Card>

          <div className="grid gap-5">
            {content.lessonBlocks.map((lesson) => {
              const isOpen = openLessonId === lesson.id;
              return (
                <Card key={lesson.id}>
                  <button
                    type="button"
                    onClick={() => setOpenLessonId(isOpen ? "" : lesson.id)}
                    className="flex w-full items-center justify-between text-left"
                    aria-expanded={isOpen}
                    aria-controls={`lesson-panel-${lesson.id}`}
                  >
                    <span className="text-2xl font-semibold">{lessonLabel[lesson.lessonType]}</span>
                    <span className="text-sm text-[var(--muted)]">{isOpen ? "Sluit" : "Open"}</span>
                  </button>
                  {isOpen ? (
                    <div id={`lesson-panel-${lesson.id}`} className="mt-5">
                      <dl className="space-y-2 text-sm">
                        <div>
                          <dt className="font-semibold">Duur</dt>
                          <dd className="text-[var(--muted)]">{lesson.duration}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold">Tarief</dt>
                          <dd className="text-[var(--muted)]">{lesson.rate}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold">Locatie</dt>
                          <dd className="text-[var(--muted)]">{lesson.location}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold">Beschikbaarheid</dt>
                          <dd className="text-[var(--muted)]">{lesson.availability}</dd>
                        </div>
                      </dl>
                      {lesson.externalLink ? (
                        <div className="mt-6">
                          <ButtonLink href={lesson.externalLink} newTab>
                            Vraag lesinformatie aan
                          </ButtonLink>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </Card>
              );
            })}
          </div>
        </SectionShell>

        <SectionShell id="contact" title={content.sectionHeaders.contact.title} intro={content.sectionHeaders.contact.intro} alternating>
          <div className="mb-6 flex flex-wrap gap-2">
            <a
              href="tel:+31615085978"
              className="rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm font-semibold text-[var(--text)]"
            >
              Bel
            </a>
            <a
              href={`mailto:${content.contactInfo.email}`}
              className="rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm font-semibold text-[var(--text)]"
            >
              Mail
            </a>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <Card>
              <h3 className="text-2xl font-semibold">Direct contact</h3>
              <p className="mt-3">
                <span className="font-semibold">Telefoon:</span>{" "}
                <a href="tel:+31615085978" className="underline underline-offset-4">
                  {content.contactInfo.phone}
                </a>
              </p>
              <p className="mt-2">
                <span className="font-semibold">E-mail:</span>{" "}
                <a href={`mailto:${content.contactInfo.email}`} className="underline underline-offset-4">
                  {content.contactInfo.email}
                </a>
              </p>
              <p className="mt-3 text-[var(--muted)]">{content.contactInfo.practicalInfo}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Je ontvangt zo snel mogelijk een reactie op je aanvraag.</p>
            </Card>

            <Card>
              <h3 className="text-2xl font-semibold">Contactformulier</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Berichten worden verzonden via je e-mailclient. Vermeld bij voorkeur datum, locatie en type aanvraag.
              </p>
              <div id="contact-form" className="mt-3">
                <ContactForm contactInfo={content.contactInfo} />
              </div>
            </Card>
          </div>
        </SectionShell>
      </main>

    </>
  );
}
