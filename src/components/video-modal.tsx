"use client";

import { useEffect, useState } from "react";

type GalleryVideo = {
  title: string;
  videoId: string;
};

type VideoModalProps = {
  videos: GalleryVideo[];
  activeIndex: number;
  onChangeIndex: (nextIndex: number) => void;
  onClose: () => void;
};

export function VideoModal({ videos, activeIndex, onChangeIndex, onClose }: VideoModalProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const safeIndex = Math.min(Math.max(activeIndex, 0), videos.length - 1);
  const activeVideo = videos[safeIndex];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onChangeIndex((safeIndex + 1) % videos.length);
      if (event.key === "ArrowLeft") onChangeIndex((safeIndex - 1 + videos.length) % videos.length);
    };

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => setReducedMotion(mediaQuery.matches);
    syncMotionPreference();

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    mediaQuery.addEventListener("change", syncMotionPreference);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      mediaQuery.removeEventListener("change", syncMotionPreference);
    };
  }, [onClose, onChangeIndex, safeIndex, videos.length]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Video: ${activeVideo.title}`}
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl rounded-xl bg-black p-3 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-2 flex items-center justify-between">
          <p className="pr-3 text-sm font-semibold text-white">
            {activeVideo.title} <span className="text-white/65">({safeIndex + 1}/{videos.length})</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChangeIndex((safeIndex - 1 + videos.length) % videos.length)}
              className="rounded-md border border-white/30 px-3 py-1 text-sm text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Vorige
            </button>
            <button
              type="button"
              onClick={() => onChangeIndex((safeIndex + 1) % videos.length)}
              className="rounded-md border border-white/30 px-3 py-1 text-sm text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Volgende
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-white/30 px-3 py-1 text-sm text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Sluiten
            </button>
          </div>
        </div>
        <div className="aspect-video w-full overflow-hidden rounded-lg">
          <iframe
            title={activeVideo.title}
            src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=${reducedMotion ? 0 : 1}&rel=0`}
            className="h-full w-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
