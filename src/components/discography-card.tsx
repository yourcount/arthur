import type { DiscographyItem } from "@/types/content";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button-link";

type DiscographyCardProps = {
  item: DiscographyItem;
};

export function DiscographyCard({ item }: DiscographyCardProps) {
  return (
    <Card className="border-l-4 border-l-[var(--wood-dark)]">
      <p className="text-xs font-medium tracking-wide text-[var(--muted)] uppercase">{item.year}</p>
      <h3 className="mt-2 text-xl font-semibold leading-tight">{item.artist}</h3>
      <p className="mt-1 text-base">{item.title}</p>
      <p className="mt-1 text-sm text-[var(--muted)]">{item.releaseType}</p>
      {item.label ? <p className="mt-1 text-sm text-[var(--muted)]">{item.label}</p> : null}
      {item.platformUrl ? (
        <div className="mt-4">
          <ButtonLink href={item.platformUrl} newTab>
            Beluister release
          </ButtonLink>
        </div>
      ) : null}
    </Card>
  );
}
