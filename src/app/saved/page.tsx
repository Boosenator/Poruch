import { SiteHeader } from "@/components/layout/SiteHeader";
import { PlaceCardLink } from "@/components/place/PlaceCardLink";
import { MOCK_PLACES } from "@/lib/mock-places";

const savedIds = ["ua-embassy", "nova-skola", "ua-school"];
const savedPlaces = MOCK_PLACES.filter((place) => savedIds.includes(place.id));

export default function SavedPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F7] text-neutral-900">
      <SiteHeader active="saved" />
      <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-neutral-950">Збережені місця</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
          Поки це моковий список. Після авторизації тут будуть особисті збереження з Supabase.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {savedPlaces.map((place) => (
            <PlaceCardLink key={place.id} place={place} saved />
          ))}
        </div>
      </section>
    </main>
  );
}
