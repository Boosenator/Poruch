"use client";

import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import type { Place } from "@/lib/types";

const PRAGUE_CENTER = {
  longitude: 14.4378,
  latitude: 50.0755,
};

type MapViewProps = {
  places: Place[];
  selectedId?: string;
  onSelectPlace: (place: Place) => void;
};

export function MapView({ places, selectedId, onSelectPlace }: MapViewProps) {
  const hasToken = Boolean(process.env.NEXT_PUBLIC_MAPBOX_TOKEN);

  if (!hasToken) {
    return (
      <div className="flex h-full min-h-[520px] items-center justify-center bg-[#E8E3DA] p-6 text-center">
        <div className="max-w-sm rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <MapPin className="mx-auto text-[#C1440E]" size={28} />
          <p className="mt-3 text-sm font-medium text-neutral-900">Mapbox токен не знайдено</p>
          <p className="mt-1 text-sm leading-6 text-neutral-500">
            Додай NEXT_PUBLIC_MAPBOX_TOKEN у .env.local і перезапусти dev server.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{
        ...PRAGUE_CENTER,
        zoom: 12,
      }}
      mapStyle="mapbox://styles/mapbox/light-v11"
      style={{ width: "100%", height: "100%", minHeight: "520px" }}
      attributionControl={false}
    >
      <NavigationControl position="top-right" />

      {places.map((place) => {
        const category = CATEGORIES.find((item) => item.id === place.category) ?? CATEGORIES[0];
        const isSelected = selectedId === place.id;

        return (
          <Marker
            key={place.id}
            longitude={place.lng}
            latitude={place.lat}
            anchor="bottom"
            onClick={(event) => {
              event.originalEvent.stopPropagation();
              onSelectPlace(place);
            }}
          >
            <button
              type="button"
              className={[
                "flex items-center justify-center rounded-full border-2 border-white text-white shadow-lg transition-transform hover:scale-110",
                isSelected ? "size-12 scale-110" : "size-9",
              ].join(" ")}
              style={{ backgroundColor: category.color }}
              aria-label={place.name}
            >
              <MapPin size={isSelected ? 22 : 17} fill="currentColor" />
            </button>
          </Marker>
        );
      })}
    </Map>
  );
}
