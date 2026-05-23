import Link from "next/link";
import { Bookmark, MapPin, Star } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import type { Place } from "@/lib/types";

type PlaceCardLinkProps = {
  place: Place;
  saved?: boolean;
};

export function PlaceCardLink({ place, saved = false }: PlaceCardLinkProps) {
  const category = CATEGORIES.find((item) => item.id === place.category) ?? CATEGORIES[0];

  return (
    <Link
      href={`/place/${place.id}`}
      className="block rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-colors hover:border-[#C1440E]/50"
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: category.color }}
        >
          <MapPin size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-3">
            <span className="font-semibold text-neutral-950">{place.name}</span>
            {saved && <Bookmark size={17} className="shrink-0 text-[#C1440E]" fill="currentColor" />}
          </span>
          <span className="mt-1 block text-sm text-neutral-500">{place.address}</span>
          <span className="mt-2 flex items-center gap-1 text-xs text-neutral-500">
            <Star className="text-amber-400" size={13} fill="currentColor" />
            {place.rating?.toFixed(1) ?? "4.8"} · {place.review_count ?? 0} відгуків
            {place.distance_label ? ` · ${place.distance_label}` : ""}
          </span>
          <span className="mt-3 flex flex-wrap gap-1.5">
            {place.is_verified && (
              <span className="rounded-full bg-[#C1440E] px-2 py-0.5 text-xs font-medium text-white">
                Verified
              </span>
            )}
            {place.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-700">
                {tag}
              </span>
            ))}
          </span>
        </span>
      </div>
    </Link>
  );
}
