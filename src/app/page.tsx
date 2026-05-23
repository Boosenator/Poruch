"use client";

import { useMemo, useState } from "react";
import {
  Bookmark,
  Check,
  Clock3,
  ExternalLink,
  LocateFixed,
  MapPin,
  Menu,
  Navigation,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { CategoryFilter } from "@/components/search/CategoryFilter";
import type { Place } from "@/lib/types";

const places: Place[] = [
  {
    id: "ua-embassy",
    name: "Посольство України в Чехії",
    category: "legal",
    address: "Charlese de Gaulle 29, Praha 6",
    lat: 50.1038,
    lng: 14.3946,
    phone: "+420 233 342 000",
    website: "https://czechia.mfa.gov.ua",
    hours: { today: "09:00-12:00" },
    languages: ["uk", "cs"],
    tags: ["документи", "консульство", "офіційно"],
    photos: [],
    is_verified: true,
    is_active: true,
    is_free: true,
    views_count: 1254,
    saves_count: 318,
    description: "Консульські послуги, оформлення документів і базова навігація з офіційних питань.",
  },
  {
    id: "cic-praha",
    name: "Centrum pro integraci cizinců",
    category: "legal",
    address: "Jeremenkova 5, Praha 4",
    lat: 50.0479,
    lng: 14.4246,
    phone: "+420 296 325 345",
    website: "https://cicpraha.org",
    hours: { today: "10:00-17:00" },
    languages: ["uk", "cs", "en"],
    tags: ["інтеграція", "право", "безкоштовно"],
    photos: [],
    is_verified: true,
    is_active: true,
    is_free: true,
    views_count: 943,
    saves_count: 221,
    description: "Безкоштовна юридична та соціальна допомога для іноземців у Празі.",
  },
  {
    id: "nova-skola",
    name: "Nová škola: курси чеської",
    category: "language",
    address: "Ostrovského 253, Praha 5",
    lat: 50.0692,
    lng: 14.4021,
    phone: "+420 257 942 320",
    website: "https://novaskola.org",
    hours: { today: "08:30-18:00" },
    languages: ["uk", "cs"],
    tags: ["чеська", "курси", "сертифікат"],
    photos: [],
    is_verified: true,
    is_active: true,
    is_free: false,
    views_count: 732,
    saves_count: 147,
    description: "Курси чеської мови для дорослих та підлітків, групи A1-B2.",
  },
  {
    id: "pediatrician-vinohrady",
    name: "Педіатрія Виногради",
    category: "medicine",
    address: "Vinohrady, Praha 2",
    lat: 50.075,
    lng: 14.448,
    phone: "+420 777 123 456",
    website: null,
    hours: { today: "12:00-16:30" },
    languages: ["uk", "cs"],
    tags: ["діти", "українською", "прийом"],
    photos: [],
    is_verified: true,
    is_active: true,
    is_free: false,
    views_count: 1189,
    saves_count: 396,
    description: "Україномовний прийом дітей, профілактичні огляди та консультації для родин.",
  },
  {
    id: "jobs-for-ukraine",
    name: "Jobs for Ukraine Praha",
    category: "work",
    address: "Václavské náměstí 1, Praha 1",
    lat: 50.081,
    lng: 14.4277,
    phone: null,
    website: "https://jobsforukraine.net",
    hours: { today: "Онлайн" },
    languages: ["uk", "cs", "en"],
    tags: ["робота", "вакансії", "консультації"],
    photos: [],
    is_verified: true,
    is_active: true,
    is_free: true,
    views_count: 856,
    saves_count: 202,
    description: "Підбір вакансій, ярмарки роботи та консультації щодо працевлаштування.",
  },
  {
    id: "ridne-shop",
    name: "Крамниця Рідне",
    category: "shops",
    address: "Žižkov, Praha 3",
    lat: 50.0853,
    lng: 14.4521,
    phone: "+420 608 987 654",
    website: null,
    hours: { today: "09:00-20:00" },
    languages: ["uk"],
    tags: ["продукти", "книги", "з України"],
    photos: [],
    is_verified: true,
    is_active: true,
    is_free: false,
    views_count: 641,
    saves_count: 113,
    description: "Українські продукти, косметика, книжки та дрібні речі для дому.",
  },
  {
    id: "lviv-croissants",
    name: "Lviv Croissants Praha",
    category: "cafe",
    address: "Senovážné náměstí 3, Praha 1",
    lat: 50.085,
    lng: 14.432,
    phone: null,
    website: null,
    hours: { today: "08:00-21:00" },
    languages: ["uk", "cs"],
    tags: ["кава", "перекус", "центр"],
    photos: [],
    is_verified: false,
    is_active: true,
    is_free: false,
    views_count: 421,
    saves_count: 88,
    description: "Знайома їжа, кава і швидкі зустрічі поруч із центром Праги.",
  },
  {
    id: "ua-school",
    name: "Українська недільна школа",
    category: "community",
    address: "Vinohrady, Praha 2",
    lat: 50.072,
    lng: 14.4418,
    phone: null,
    website: null,
    hours: { today: "Сб 10:00-14:00" },
    languages: ["uk"],
    tags: ["діти", "культура", "зустрічі"],
    photos: [],
    is_verified: true,
    is_active: true,
    is_free: true,
    views_count: 512,
    saves_count: 174,
    description: "Українська мова, культура та спільні заняття для дітей і батьків.",
  },
];

const languageLabels: Record<string, string> = {
  uk: "українська",
  cs: "чеська",
  en: "англійська",
};

function getCategory(categoryId: string) {
  return CATEGORIES.find((category) => category.id === categoryId) ?? CATEGORIES[0];
}

function getPinPosition(place: Place) {
  const left = ((place.lng - 14.36) / (14.48 - 14.36)) * 100;
  const top = 100 - ((place.lat - 50.04) / (50.12 - 50.04)) * 100;

  return {
    left: `${Math.min(90, Math.max(10, left))}%`,
    top: `${Math.min(82, Math.max(12, top))}%`,
  };
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(places[0].id);

  const counts = useMemo(() => {
    const totals: Record<string, number> = { all: places.length };
    places.forEach((place) => {
      totals[place.category] = (totals[place.category] ?? 0) + 1;
    });
    return totals;
  }, []);

  const filteredPlaces = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return places.filter((place) => {
      const matchesCategory = activeCategory === "all" || place.category === activeCategory;
      const searchable = [place.name, place.address, place.description, ...place.tags]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [activeCategory, query]);

  const selectedPlace =
    filteredPlaces.find((place) => place.id === selectedId) ?? filteredPlaces[0] ?? null;

  function handleCategorySelect(categoryId: string) {
    setActiveCategory(categoryId);
    const nextPlace = places.find((place) => categoryId === "all" || place.category === categoryId);
    if (nextPlace) setSelectedId(nextPlace.id);
  }

  return (
    <main className="min-h-screen bg-[#FAF9F7] text-neutral-900">
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-[#FAF9F7]/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-[#C1440E] text-white">
              <MapPin size={21} />
            </div>
            <div>
              <p className="text-lg font-semibold leading-tight">Поруч</p>
              <p className="text-xs text-neutral-500">Прага</p>
            </div>
          </div>
          <nav className="hidden items-center gap-1 text-sm font-medium text-neutral-600 md:flex">
            <a className="rounded-full px-3 py-2 text-[#C1440E]" href="#">
              Карта
            </a>
            <a className="rounded-full px-3 py-2 hover:bg-white" href="#">
              Список
            </a>
            <a className="rounded-full px-3 py-2 hover:bg-white" href="#">
              Збережені
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <button className="hidden h-10 items-center gap-2 rounded-lg bg-[#C1440E] px-4 text-sm font-medium text-white transition-colors hover:bg-[#A33A0B] sm:flex">
              <Sparkles size={16} />
              Додати місце
            </button>
            <button className="flex size-10 items-center justify-center rounded-lg border border-neutral-200 bg-white md:hidden">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      <section className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-[420px_minmax(0,1fr)_360px]">
        <aside className="border-b border-neutral-200 bg-[#FAF9F7] px-5 py-5 lg:border-b-0 lg:border-r">
          <div className="space-y-5">
            <div>
              <h1 className="text-3xl font-semibold tracking-normal text-neutral-950">
                Твій путівник у новому місті
              </h1>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                Перевірені ресурси для українців у Чехії: медицина, документи, мова,
                робота і спільнота.
              </p>
            </div>

            <label className="flex h-12 items-center gap-3 rounded-lg border border-neutral-200 bg-white px-4 shadow-sm">
              <Search size={18} className="text-neutral-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Пошук за назвою, адресою або тегом"
                className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
              />
            </label>

            <CategoryFilter
              categories={CATEGORIES}
              activeCategory={activeCategory}
              onSelect={handleCategorySelect}
              counts={counts}
            />

            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-neutral-800">
                Знайдено {filteredPlaces.length} місць
              </span>
              <span className="text-neutral-500">Мок-дані</span>
            </div>

            <div className="space-y-3">
              {filteredPlaces.map((place) => {
                const category = getCategory(place.category);
                const isSelected = selectedPlace?.id === place.id;

                return (
                  <button
                    key={place.id}
                    type="button"
                    onClick={() => setSelectedId(place.id)}
                    className={[
                      "w-full rounded-lg border bg-white p-4 text-left shadow-sm transition-all",
                      isSelected
                        ? "border-[#C1440E] ring-2 ring-[#C1440E]/10"
                        : "border-neutral-200 hover:border-[#C1440E]/40",
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-full text-white"
                        style={{ backgroundColor: category.color }}
                      >
                        <MapPin size={17} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-3">
                          <span className="font-semibold text-neutral-950">{place.name}</span>
                          {place.is_verified && (
                            <span className="rounded-full bg-[#C1440E] px-2 py-0.5 text-xs font-medium text-white">
                              Verified
                            </span>
                          )}
                        </span>
                        <span className="mt-1 block text-sm text-neutral-500">{place.address}</span>
                        <span className="mt-3 flex flex-wrap gap-1.5">
                          {place.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <section className="relative min-h-[520px] overflow-hidden bg-[#E8E3DA] lg:min-h-0">
          <div className="absolute inset-0 map-texture" />
          <div className="absolute left-6 top-6 z-10 flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium shadow-sm">
            <LocateFixed size={16} className="text-[#C1440E]" />
            Praha centrum
          </div>
          <div className="absolute bottom-6 left-6 z-10 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-600 shadow-sm">
            Mapbox підключимо після токена
          </div>

          <div className="absolute left-[8%] top-[48%] h-5 w-[88%] -rotate-12 rounded-full bg-[#B8D7DC]/80" />
          <div className="absolute left-[16%] top-[18%] h-[76%] w-4 rotate-[28deg] rounded-full bg-[#B8D7DC]/70" />
          <div className="absolute left-[22%] top-[26%] h-2 w-[64%] rotate-6 rounded-full bg-white/70" />
          <div className="absolute left-[18%] top-[62%] h-2 w-[58%] -rotate-[22deg] rounded-full bg-white/70" />
          <div className="absolute left-[46%] top-[10%] h-[78%] w-2 rotate-2 rounded-full bg-white/60" />

          {filteredPlaces.map((place) => {
            const category = getCategory(place.category);
            const isSelected = selectedPlace?.id === place.id;

            return (
              <button
                key={place.id}
                type="button"
                onClick={() => setSelectedId(place.id)}
                className={[
                  "absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-white shadow-lg transition-transform hover:scale-110",
                  isSelected ? "size-12 scale-110" : "size-9",
                ].join(" ")}
                style={{ ...getPinPosition(place), backgroundColor: category.color }}
                aria-label={place.name}
              >
                <MapPin size={isSelected ? 22 : 17} fill="currentColor" />
              </button>
            );
          })}
        </section>

        <aside className="border-t border-neutral-200 bg-white lg:border-l lg:border-t-0">
          {selectedPlace ? (
            <PlaceDetails place={selectedPlace} totalCount={filteredPlaces.length} />
          ) : (
            <div className="flex min-h-80 flex-col items-center justify-center gap-3 p-6 text-center text-neutral-400">
              <MapPin size={40} strokeWidth={1.4} />
              <p className="text-sm">Натисни на маркер, щоб побачити деталі</p>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

function PlaceDetails({ place, totalCount }: { place: Place; totalCount: number }) {
  const category = getCategory(place.category);

  return (
    <div className="flex h-full flex-col">
      <div className="p-5">
        <div className="mb-5 h-36 rounded-lg bg-[#F2EFE9] p-4">
          <div className="flex h-full items-end justify-between rounded-md bg-white/60 p-4">
            <div>
              <p className="text-xs font-medium uppercase text-neutral-500">{category.label}</p>
              <p className="mt-1 text-lg font-semibold">{place.name}</p>
            </div>
            <span
              className="flex size-11 items-center justify-center rounded-full text-white shadow-sm"
              style={{ backgroundColor: category.color }}
            >
              <MapPin size={20} />
            </span>
          </div>
        </div>

        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold text-neutral-950">{place.name}</h2>
              {place.is_verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#C1440E] px-2 py-0.5 text-xs font-medium text-white">
                  <Check size={12} />
                  Verified
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center gap-1 text-sm">
              <Star className="text-amber-400" size={15} fill="currentColor" />
              <span className="font-medium">4.8</span>
              <span className="text-neutral-400">({Math.max(7, Math.round(place.saves_count / 8))} відгуків)</span>
            </div>
          </div>
          <button className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-neutral-200 hover:bg-neutral-100">
            <Bookmark size={18} />
          </button>
        </div>

        <p className="mt-4 text-sm leading-6 text-neutral-600">{place.description}</p>

        <div className="mt-5 space-y-3">
          <InfoRow icon={<MapPin size={16} />} text={place.address ?? "Адресу уточнюємо"} />
          {place.phone && <InfoRow icon={<Phone size={16} />} text={place.phone} />}
          <InfoRow icon={<Clock3 size={16} />} text={place.hours?.today ?? "Графік уточнюємо"} />
          <InfoRow
            icon={<ShieldCheck size={16} />}
            text={place.languages.map((lang) => languageLabels[lang] ?? lang).join(", ")}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {place.tags.map((tag) => (
            <span key={tag} className="rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-700">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <a
            href={place.phone ? `tel:${place.phone}` : "#"}
            className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#C1440E] px-4 text-sm font-medium text-white transition-colors hover:bg-[#A33A0B]"
          >
            <Phone size={16} />
            Дзвінок
          </a>
          <a
            href={`https://maps.google.com/?q=${place.lat},${place.lng}`}
            target="_blank"
            className="flex h-11 items-center justify-center gap-2 rounded-lg border border-neutral-200 px-4 text-sm font-medium transition-colors hover:bg-neutral-100"
          >
            <Navigation size={16} />
            Маршрут
          </a>
        </div>

        {place.website && (
          <a
            href={place.website}
            target="_blank"
            className="mt-3 flex h-11 items-center justify-center gap-2 rounded-lg border border-neutral-200 text-sm font-medium transition-colors hover:bg-neutral-100"
          >
            <ExternalLink size={16} />
            Відкрити сайт
          </a>
        )}
      </div>

      <div className="mt-auto border-t border-neutral-100 px-5 py-3 text-xs text-neutral-400">
        Знайдено <strong className="text-neutral-600">{totalCount}</strong> місць у поточному фільтрі
      </div>
    </div>
  );
}

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-2 text-sm text-neutral-600">
      <span className="mt-0.5 shrink-0 text-[#C1440E]">{icon}</span>
      <span>{text}</span>
    </div>
  );
}
