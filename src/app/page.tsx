"use client";

import { useMemo, useState } from "react";
import {
  Bookmark,
  Check,
  Clock3,
  ExternalLink,
  HeartHandshake,
  List,
  MapIcon,
  MapPin,
  Menu,
  Navigation,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { MapView } from "@/components/map/MapView";
import { CategoryFilter } from "@/components/search/CategoryFilter";
import { CATEGORIES } from "@/lib/categories";
import { MOCK_PLACES } from "@/lib/mock-places";
import type { Place } from "@/lib/types";

type ViewMode = "map" | "list" | "saved";
type MobileSheetMode = "list" | "details";

const MOBILE_MAP_PADDING = { top: 150, bottom: 150, left: 48, right: 48 };
const DESKTOP_MAP_PADDING = { top: 80, bottom: 80, left: 80, right: 80 };

const languageLabels: Record<string, string> = {
  uk: "українська",
  cs: "чеська",
  en: "англійська",
};

function getCategory(categoryId: string) {
  return CATEGORIES.find((category) => category.id === categoryId) ?? CATEGORIES[0];
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [mobileSheetMode, setMobileSheetMode] = useState<MobileSheetMode>("list");
  const [savedIds, setSavedIds] = useState<string[]>(["ua-embassy", "nova-skola", "ua-school"]);

  const counts = useMemo(() => {
    const totals: Record<string, number> = { all: MOCK_PLACES.length };
    MOCK_PLACES.forEach((place) => {
      totals[place.category] = (totals[place.category] ?? 0) + 1;
    });
    return totals;
  }, []);

  const filteredPlaces = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return MOCK_PLACES.filter((place) => {
      const matchesCategory = activeCategory === "all" || place.category === activeCategory;
      const searchable = [place.name, place.address, place.description, ...place.tags]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [activeCategory, query]);

  const visiblePlaces = useMemo(() => {
    if (viewMode !== "saved") {
      return filteredPlaces;
    }

    return filteredPlaces.filter((place) => savedIds.includes(place.id));
  }, [filteredPlaces, savedIds, viewMode]);

  const selectedPlace =
    selectedId ? filteredPlaces.find((place) => place.id === selectedId) ?? null : null;

  const verifiedCount = visiblePlaces.filter((place) => place.is_verified).length;
  const freeCount = visiblePlaces.filter((place) => place.is_free).length;

  function handleCategorySelect(categoryId: string) {
    setActiveCategory(categoryId);
    setViewMode("map");
    setSelectedId(null);
    setMobilePanelOpen(false);
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    setViewMode("map");
    setSelectedId(null);
    setMobilePanelOpen(false);
  }

  function toggleSaved(placeId: string) {
    setSavedIds((current) =>
      current.includes(placeId) ? current.filter((id) => id !== placeId) : [...current, placeId],
    );
  }

  function selectPlace(place: Place) {
    setSelectedId(place.id);
    setMobilePanelOpen(false);
    if (viewMode === "list" || viewMode === "saved") {
      setViewMode("map");
    }
  }

  function openMobileList() {
    setMobileSheetMode("list");
    setMobilePanelOpen(true);
  }

  function openMobileDetails() {
    if (!selectedPlace) return;
    setMobileSheetMode("details");
    setMobilePanelOpen(true);
  }

  return (
    <main className="min-h-screen bg-[#FAF9F7] text-neutral-900">
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-[#FAF9F7]/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setViewMode("map")}
            className="flex items-center gap-3 text-left"
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-[#C1440E] text-white">
              <MapPin size={21} />
            </div>
            <div>
              <p className="text-lg font-semibold leading-tight">Поруч</p>
              <p className="text-xs text-neutral-500">Прага</p>
            </div>
          </button>

          <nav className="hidden items-center rounded-full border border-neutral-200 bg-white p-1 text-sm font-medium text-neutral-600 lg:flex">
            <ModeButton active={viewMode === "map"} onClick={() => setViewMode("map")} icon={<MapIcon size={15} />}>
              Карта
            </ModeButton>
            <ModeButton active={viewMode === "list"} onClick={() => setViewMode("list")} icon={<List size={15} />}>
              Список
            </ModeButton>
            <ModeButton
              active={viewMode === "saved"}
              onClick={() => setViewMode("saved")}
              icon={<Bookmark size={15} />}
            >
              Збережені
            </ModeButton>
          </nav>

          <div className="flex items-center gap-2">
            <button className="hidden h-10 items-center gap-2 rounded-lg bg-[#C1440E] px-4 text-sm font-medium text-white transition-colors hover:bg-[#A33A0B] sm:flex">
              <Sparkles size={16} />
              Додати місце
            </button>
            <button
              type="button"
              onClick={openMobileList}
              className="flex size-10 items-center justify-center rounded-lg border border-neutral-200 bg-white lg:hidden"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      <section className="grid min-h-[calc(100vh-4rem)] grid-cols-1 lg:grid-cols-[420px_minmax(0,1fr)_360px]">
        <aside className="hidden border-b border-neutral-200 bg-[#FAF9F7] px-5 py-5 lg:block lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <div className="space-y-5">
            <div>
              <h1 className="text-3xl font-semibold tracking-normal text-neutral-950">
                Твій путівник у новому місті
              </h1>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                Перевірені ресурси для українців у Чехії: медицина, документи, мова, робота,
                житло і спільнота.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Metric value={visiblePlaces.length} label="місць" />
              <Metric value={verifiedCount} label="перевірено" />
              <Metric value={freeCount} label="безкоштовно" />
            </div>

            <label className="flex h-12 items-center gap-3 rounded-lg border border-neutral-200 bg-white px-4 shadow-sm">
              <Search size={18} className="text-neutral-400" />
              <input
                value={query}
                onChange={(event) => handleQueryChange(event.target.value)}
                placeholder="Пошук за назвою, адресою або тегом"
                className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
              />
            </label>

            <div className="md:hidden">
              <div className="grid grid-cols-3 rounded-lg border border-neutral-200 bg-white p-1 text-sm font-medium">
                <MobileModeButton active={viewMode === "map"} onClick={() => setViewMode("map")}>
                  Карта
                </MobileModeButton>
                <MobileModeButton active={viewMode === "list"} onClick={() => setViewMode("list")}>
                  Список
                </MobileModeButton>
                <MobileModeButton active={viewMode === "saved"} onClick={() => setViewMode("saved")}>
                  Збережені
                </MobileModeButton>
              </div>
            </div>

            <CategoryFilter
              categories={CATEGORIES}
              activeCategory={activeCategory}
              onSelect={handleCategorySelect}
              counts={counts}
            />

            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-neutral-800">
                {viewMode === "saved" ? "Збережені" : "Знайдено"} {visiblePlaces.length} місць
              </span>
              <span className="text-neutral-500">Мок-дані</span>
            </div>

            {visiblePlaces.length > 0 ? (
              <div className="space-y-3">
                {visiblePlaces.map((place) => (
                  <PlaceListCard
                    key={place.id}
                    place={place}
                    isSelected={selectedPlace?.id === place.id}
                    isSaved={savedIds.includes(place.id)}
                    onSelect={() => setSelectedId(place.id)}
                    onToggleSaved={() => toggleSaved(place.id)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState mode={viewMode} />
            )}
          </div>
        </aside>

        <section className="relative h-[calc(100svh-4rem)] overflow-hidden bg-[#E8E3DA] lg:h-auto lg:min-h-0">
          <div className="h-[calc(100svh-4rem)] lg:hidden">
            <MapView
              places={filteredPlaces}
              selectedId={selectedId}
              onSelectPlace={(place) => setSelectedId(place.id)}
              onClearSelection={() => setSelectedId(null)}
              showPopup={false}
              fitPadding={MOBILE_MAP_PADDING}
            />
          </div>

          <div className="hidden h-full lg:block">
            {viewMode === "list" || viewMode === "saved" ? (
              <ListCanvas
                places={visiblePlaces}
                savedIds={savedIds}
                onSelectPlace={selectPlace}
                onToggleSaved={toggleSaved}
                mode={viewMode}
              />
            ) : (
              <MapView
                places={visiblePlaces}
                selectedId={selectedId}
                onSelectPlace={(place) => setSelectedId(place.id)}
                onClearSelection={() => setSelectedId(null)}
                fitPadding={DESKTOP_MAP_PADDING}
              />
            )}
          </div>

          <div className="pointer-events-none fixed inset-x-0 top-16 z-50 space-y-2 p-3 lg:hidden">
            <div className="pointer-events-auto rounded-lg border border-neutral-200 bg-white/95 p-3 shadow-lg backdrop-blur">
              <label className="flex h-10 items-center gap-3 rounded-lg border border-neutral-200 bg-white px-3">
                <Search size={16} className="text-neutral-400" />
                <input
                value={query}
                  onChange={(event) => handleQueryChange(event.target.value)}
                  placeholder="Пошук місць"
                  className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400"
                />
              </label>
              <div className="mt-3">
                <MobileCategoryFilter
                  categories={CATEGORIES}
                  activeCategory={activeCategory}
                  onSelect={handleCategorySelect}
                  counts={counts}
                />
              </div>
            </div>
          </div>

          <div className="pointer-events-none fixed inset-x-3 bottom-3 z-30 lg:hidden">
            {!mobilePanelOpen && (
              <div className="space-y-2">
                {selectedPlace && (
                  <div className="pointer-events-auto flex w-full items-start gap-2 rounded-lg border border-neutral-200 bg-white p-3 shadow-lg">
                    <button type="button" onClick={openMobileDetails} className="min-w-0 flex-1 text-left">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-neutral-950">{selectedPlace.name}</p>
                        <p className="mt-1 truncate text-sm text-neutral-500">{selectedPlace.address}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-[#C1440E] px-2 py-1 text-xs font-medium text-white">
                        Деталі
                      </span>
                    </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedId(null)}
                      className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500"
                      aria-label="Закрити обране місце"
                    >
                      <X size={15} />
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={openMobileList}
                  className="pointer-events-auto flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#C1440E] px-4 text-sm font-semibold text-white shadow-lg"
                >
                  <List size={17} />
                  Показати {filteredPlaces.length} місць
                </button>
              </div>
            )}

            <div
              className={[
                "max-h-[72svh] overflow-hidden rounded-t-2xl border border-neutral-200 bg-[#FAF9F7] shadow-2xl transition-transform duration-300",
                mobilePanelOpen
                  ? "pointer-events-auto translate-y-0"
                  : "pointer-events-none translate-y-[calc(100%+1rem)]",
              ].join(" ")}
            >
              <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-neutral-950">
                    {mobileSheetMode === "details"
                      ? "Деталі місця"
                      : viewMode === "saved"
                        ? "Збережені місця"
                        : "Місця поруч"}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {mobileSheetMode === "details" ? selectedPlace?.address : `${visiblePlaces.length} результатів`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMobilePanelOpen(false)}
                  className="flex size-9 items-center justify-center rounded-lg border border-neutral-200"
                  aria-label="Закрити список"
                >
                  <X size={17} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1 border-b border-neutral-200 bg-white p-2 text-sm font-medium">
                <MobileModeButton
                  active={mobileSheetMode === "details"}
                  onClick={() => setMobileSheetMode("details")}
                >
                  Деталі
                </MobileModeButton>
                <MobileModeButton
                  active={mobileSheetMode === "list" && viewMode !== "saved"}
                  onClick={() => {
                    setMobileSheetMode("list");
                    setViewMode("map");
                  }}
                >
                  Карта
                </MobileModeButton>
                <MobileModeButton
                  active={mobileSheetMode === "list" && viewMode === "saved"}
                  onClick={() => {
                    setMobileSheetMode("list");
                    setViewMode("saved");
                  }}
                >
                  Збережені
                </MobileModeButton>
              </div>
              <div className="max-h-[52svh] overflow-y-auto p-3">
                {mobileSheetMode === "details" && selectedPlace ? (
                  <MobilePlaceDetails
                    place={selectedPlace}
                    isSaved={savedIds.includes(selectedPlace.id)}
                    onToggleSaved={() => toggleSaved(selectedPlace.id)}
                  />
                ) : visiblePlaces.length > 0 ? (
                  <div className="space-y-3">
                    {visiblePlaces.map((place) => (
                      <PlaceListCard
                        key={place.id}
                        place={place}
                        isSelected={selectedPlace?.id === place.id}
                        isSaved={savedIds.includes(place.id)}
                        onSelect={() => selectPlace(place)}
                        onToggleSaved={() => toggleSaved(place.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState mode={viewMode} />
                )}
              </div>
            </div>
          </div>
        </section>

        <aside className="hidden border-t border-neutral-200 bg-white lg:block lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto lg:border-l lg:border-t-0">
          {selectedPlace ? (
            <PlaceDetails
              place={selectedPlace}
              totalCount={visiblePlaces.length}
              isSaved={savedIds.includes(selectedPlace.id)}
              onToggleSaved={() => toggleSaved(selectedPlace.id)}
            />
          ) : (
            <div className="flex min-h-80 flex-col items-center justify-center gap-3 p-6 text-center text-neutral-400">
              <MapPin size={40} strokeWidth={1.4} />
              <p className="text-sm">Натисни на маркер або картку, щоб побачити деталі</p>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

function ModeButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex h-9 items-center gap-2 rounded-full px-4 transition-colors",
        active ? "bg-[#C1440E] text-white" : "hover:bg-neutral-100",
      ].join(" ")}
    >
      {icon}
      {children}
    </button>
  );
}

function MobileModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={["h-9 rounded-md transition-colors", active ? "bg-[#C1440E] text-white" : "text-neutral-600"].join(
        " ",
      )}
    >
      {children}
    </button>
  );
}

function MobileCategoryFilter({
  categories,
  activeCategory,
  onSelect,
  counts,
}: {
  categories: typeof CATEGORIES;
  activeCategory: string;
  onSelect: (categoryId: string) => void;
  counts: Record<string, number>;
}) {
  return (
    <div className="-mx-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max gap-2">
        {categories.map((category) => {
          const isActive = category.id === activeCategory;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.id)}
              className={[
                "flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium shadow-sm transition-colors",
                isActive
                  ? "bg-[#C1440E] text-white"
                  : "border border-neutral-200 bg-white text-neutral-800",
              ].join(" ")}
            >
              <span>{category.label}</span>
              <span className={isActive ? "text-white/80" : "text-neutral-400"}>
                {counts[category.id] ?? 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2">
      <p className="text-lg font-semibold text-neutral-950">{value}</p>
      <p className="text-xs text-neutral-500">{label}</p>
    </div>
  );
}

function PlaceListCard({
  place,
  isSelected,
  isSaved,
  onSelect,
  onToggleSaved,
}: {
  place: Place;
  isSelected: boolean;
  isSaved: boolean;
  onSelect: () => void;
  onToggleSaved: () => void;
}) {
  const category = getCategory(place.category);

  return (
    <div
      className={[
        "rounded-lg border bg-white p-4 shadow-sm transition-all",
        isSelected ? "border-[#C1440E] ring-2 ring-[#C1440E]/10" : "border-neutral-200 hover:border-[#C1440E]/40",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onSelect}
          className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: category.color }}
          aria-label={place.name}
        >
          <MapPin size={17} />
        </button>
        <button type="button" onClick={onSelect} className="min-w-0 flex-1 text-left">
          <span className="flex items-start justify-between gap-3">
            <span className="font-semibold text-neutral-950">{place.name}</span>
            <span className="text-xs text-neutral-400">{place.distance_label}</span>
          </span>
          <span className="mt-1 block text-sm text-neutral-500">{place.address}</span>
          <span className="mt-2 flex items-center gap-1 text-xs text-neutral-500">
            <Star className="text-amber-400" size={13} fill="currentColor" />
            {place.rating?.toFixed(1)} · {place.review_count} відгуків
          </span>
        </button>
        <button
          type="button"
          onClick={onToggleSaved}
          className={[
            "flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
            isSaved ? "border-[#C1440E] bg-[#FDF0EB] text-[#C1440E]" : "border-neutral-200 text-neutral-500",
          ].join(" ")}
          aria-label={isSaved ? "Прибрати зі збережених" : "Зберегти місце"}
        >
          <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5 pl-12">
        {place.is_verified && (
          <span className="rounded-full bg-[#C1440E] px-2 py-0.5 text-xs font-medium text-white">Verified</span>
        )}
        {place.is_free && <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs text-emerald-700">безкоштовно</span>}
        {place.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-700">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function ListCanvas({
  places,
  savedIds,
  onSelectPlace,
  onToggleSaved,
  mode,
}: {
  places: Place[];
  savedIds: string[];
  onSelectPlace: (place: Place) => void;
  onToggleSaved: (placeId: string) => void;
  mode: ViewMode;
}) {
  if (places.length === 0) {
    return (
      <div className="flex h-full min-h-[520px] items-center justify-center p-6">
        <EmptyState mode={mode} />
      </div>
    );
  }

  return (
    <div className="h-full min-h-[520px] overflow-y-auto bg-[#FAF9F7] p-5">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase text-neutral-500">{mode === "saved" ? "Збережені" : "Список"}</p>
          <h2 className="text-2xl font-semibold text-neutral-950">Місця у Празі</h2>
        </div>
        <p className="text-sm text-neutral-500">{places.length} результатів</p>
      </div>
      <div className="grid gap-3 xl:grid-cols-2">
        {places.map((place) => (
          <PlaceListCard
            key={place.id}
            place={place}
            isSelected={false}
            isSaved={savedIds.includes(place.id)}
            onSelect={() => onSelectPlace(place)}
            onToggleSaved={() => onToggleSaved(place.id)}
          />
        ))}
      </div>
    </div>
  );
}

function EmptyState({ mode }: { mode: ViewMode }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center shadow-sm">
      <HeartHandshake className="mx-auto text-[#C1440E]" size={28} />
      <p className="mt-3 font-semibold text-neutral-950">
        {mode === "saved" ? "Ще немає збережених місць" : "Нічого не знайдено"}
      </p>
      <p className="mt-1 text-sm leading-6 text-neutral-500">
        {mode === "saved"
          ? "Натисни на іконку закладки біля місця, щоб швидко повернутися до нього пізніше."
          : "Спробуй змінити категорію або пошуковий запит."}
      </p>
    </div>
  );
}

function MobilePlaceDetails({
  place,
  isSaved,
  onToggleSaved,
}: {
  place: Place;
  isSaved: boolean;
  onToggleSaved: () => void;
}) {
  const category = getCategory(place.category);

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm"
          style={{ backgroundColor: category.color }}
        >
          <MapPin size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase text-neutral-500">{category.label}</p>
          <h2 className="mt-1 text-lg font-semibold leading-6 text-neutral-950">{place.name}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {place.is_verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#C1440E] px-2 py-0.5 text-xs font-medium text-white">
                <Check size={12} />
                Verified
              </span>
            )}
            {place.is_free && (
              <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                безкоштовно
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-xs text-neutral-500">
              <Star className="text-amber-400" size={13} fill="currentColor" />
              {place.rating?.toFixed(1) ?? "4.8"} · {place.review_count ?? 0} відгуків
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleSaved}
          className={[
            "flex size-10 shrink-0 items-center justify-center rounded-lg border transition-colors",
            isSaved ? "border-[#C1440E] bg-[#FDF0EB] text-[#C1440E]" : "border-neutral-200 bg-white",
          ].join(" ")}
          aria-label={isSaved ? "Прибрати зі збережених" : "Зберегти місце"}
        >
          <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      <p className="text-sm leading-6 text-neutral-600">{place.description}</p>

      <div className="space-y-2 rounded-lg border border-neutral-200 bg-white p-3">
        <InfoRow icon={<MapPin size={16} />} text={place.address ?? "Адресу уточнюємо"} />
        {place.phone && <InfoRow icon={<Phone size={16} />} text={place.phone} />}
        <InfoRow icon={<Clock3 size={16} />} text={place.hours?.today ?? "Графік уточнюємо"} />
        <InfoRow
          icon={<ShieldCheck size={16} />}
          text={place.languages.map((lang) => languageLabels[lang] ?? lang).join(", ")}
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {place.tags.map((tag) => (
          <span key={tag} className="rounded-md bg-neutral-100 px-2 py-1 text-xs text-neutral-700">
            {tag}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
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
          className="flex h-11 items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 text-sm font-medium"
        >
          <Navigation size={16} />
          Маршрут
        </a>
      </div>

      {place.website && (
        <a
          href={place.website}
          target="_blank"
          className="flex h-11 items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white text-sm font-medium"
        >
          <ExternalLink size={16} />
          Відкрити сайт
        </a>
      )}
    </div>
  );
}

function PlaceDetails({
  place,
  totalCount,
  isSaved,
  onToggleSaved,
}: {
  place: Place;
  totalCount: number;
  isSaved: boolean;
  onToggleSaved: () => void;
}) {
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
              <span className="font-medium">{place.rating?.toFixed(1) ?? "4.8"}</span>
              <span className="text-neutral-400">({place.review_count ?? 0} відгуків)</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleSaved}
            className={[
              "flex size-10 shrink-0 items-center justify-center rounded-lg border transition-colors",
              isSaved ? "border-[#C1440E] bg-[#FDF0EB] text-[#C1440E]" : "border-neutral-200 hover:bg-neutral-100",
            ].join(" ")}
            aria-label={isSaved ? "Прибрати зі збережених" : "Зберегти місце"}
          >
            <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
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
          {place.is_free && <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs text-emerald-700">безкоштовно</span>}
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
