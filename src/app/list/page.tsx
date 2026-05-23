import { SiteHeader } from "@/components/layout/SiteHeader";
import { PlaceCardLink } from "@/components/place/PlaceCardLink";
import { CATEGORIES } from "@/lib/categories";
import { MOCK_PLACES } from "@/lib/mock-places";

export default function ListPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F7] text-neutral-900">
      <SiteHeader active="list" />
      <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-neutral-950">Список місць</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
              Усі мокові ресурси для Праги в одному списку. Далі тут будуть сортування, райони й фільтри.
            </p>
          </div>
          <p className="text-sm text-neutral-500">{MOCK_PLACES.length} місць</p>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((category) => (
            <span
              key={category.id}
              className="shrink-0 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700"
            >
              {category.label}
            </span>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {MOCK_PLACES.map((place) => (
            <PlaceCardLink key={place.id} place={place} />
          ))}
        </div>
      </section>
    </main>
  );
}
