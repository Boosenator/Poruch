import { notFound } from "next/navigation";
import { Clock3, ExternalLink, MapPin, Navigation, Phone, ShieldCheck, Star } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { CATEGORIES } from "@/lib/categories";
import { MOCK_PLACES } from "@/lib/mock-places";

type PlacePageProps = {
  params: {
    id: string;
  };
};

export function generateStaticParams() {
  return MOCK_PLACES.map((place) => ({ id: place.id }));
}

export function generateMetadata({ params }: PlacePageProps) {
  const place = MOCK_PLACES.find((item) => item.id === params.id);

  if (!place) {
    return { title: "Місце не знайдено | Поруч" };
  }

  return {
    title: `${place.name} | Поруч`,
    description: place.description ?? "Ресурс для українців у Чехії.",
  };
}

export default function PlacePage({ params }: PlacePageProps) {
  const place = MOCK_PLACES.find((item) => item.id === params.id);
  if (!place) notFound();

  const category = CATEGORIES.find((item) => item.id === place.category) ?? CATEGORIES[0];

  return (
    <main className="min-h-screen bg-[#FAF9F7] text-neutral-900">
      <SiteHeader />
      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <article className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <span
              className="flex size-12 shrink-0 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: category.color }}
            >
              <MapPin size={22} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase text-neutral-500">{category.label}</p>
              <h1 className="mt-1 text-3xl font-semibold text-neutral-950">{place.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {place.is_verified && (
                  <span className="rounded-full bg-[#C1440E] px-2 py-0.5 text-xs font-medium text-white">
                    Verified
                  </span>
                )}
                {place.is_free && (
                  <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                    безкоштовно
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-sm text-neutral-600">
                  <Star className="text-amber-400" size={15} fill="currentColor" />
                  {place.rating?.toFixed(1) ?? "4.8"} · {place.review_count ?? 0} відгуків
                </span>
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm leading-7 text-neutral-650">{place.description}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <InfoRow icon={<MapPin size={16} />} text={place.address ?? "Адресу уточнюємо"} />
            {place.phone && <InfoRow icon={<Phone size={16} />} text={place.phone} />}
            <InfoRow icon={<Clock3 size={16} />} text={place.hours?.today ?? "Графік уточнюємо"} />
            <InfoRow icon={<ShieldCheck size={16} />} text={place.languages.join(", ")} />
          </div>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {place.tags.map((tag) => (
              <span key={tag} className="rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-700">
                {tag}
              </span>
            ))}
          </div>
        </article>

        <aside className="h-fit rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-neutral-950">Дії</h2>
          <div className="mt-4 grid gap-2">
            <a
              href={place.phone ? `tel:${place.phone}` : "#"}
              className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#C1440E] px-4 text-sm font-medium text-white"
            >
              <Phone size={16} />
              Дзвінок
            </a>
            <a
              href={`https://maps.google.com/?q=${place.lat},${place.lng}`}
              target="_blank"
              className="flex h-11 items-center justify-center gap-2 rounded-lg border border-neutral-200 px-4 text-sm font-medium"
            >
              <Navigation size={16} />
              Маршрут
            </a>
            {place.website && (
              <a
                href={place.website}
                target="_blank"
                className="flex h-11 items-center justify-center gap-2 rounded-lg border border-neutral-200 px-4 text-sm font-medium"
              >
                <ExternalLink size={16} />
                Відкрити сайт
              </a>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-neutral-50 p-3 text-sm text-neutral-600">
      <span className="mt-0.5 shrink-0 text-[#C1440E]">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
