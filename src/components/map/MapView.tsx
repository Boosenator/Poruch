"use client";

import { useEffect, useMemo, useRef } from "react";
import Map, { Layer, Marker, NavigationControl, Popup, Source } from "react-map-gl/mapbox";
import type { MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import type { Place } from "@/lib/types";

const PRAGUE_CENTER = {
  longitude: 14.4378,
  latitude: 50.0755,
};

const DEFAULT_FIT_PADDING = { top: 80, bottom: 80, left: 80, right: 80 };

export type RouteGeometry = {
  type: "LineString";
  coordinates: [number, number][];
};

type MapViewProps = {
  places: Place[];
  selectedId?: string | null;
  onSelectPlace: (place: Place) => void;
  onClearSelection?: () => void;
  showPopup?: boolean;
  fitPadding?: { top: number; bottom: number; left: number; right: number };
  routeGeometry?: RouteGeometry | null;
};

export function MapView({
  places,
  selectedId,
  onSelectPlace,
  onClearSelection,
  showPopup = true,
  fitPadding = DEFAULT_FIT_PADDING,
  routeGeometry,
}: MapViewProps) {
  const mapRef = useRef<MapRef>(null);
  const hasToken = Boolean(process.env.NEXT_PUBLIC_MAPBOX_TOKEN);
  const selectedPlace = places.find((place) => place.id === selectedId);
  const boundsKey = useMemo(
    () => places.map((place) => `${place.id}:${place.lng}:${place.lat}`).join("|"),
    [places],
  );
  const routeKey = useMemo(
    () => routeGeometry?.coordinates.map(([lng, lat]) => `${lng}:${lat}`).join("|") ?? "",
    [routeGeometry],
  );

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !hasToken) return;

    if (routeGeometry?.coordinates.length) {
      const lngs = routeGeometry.coordinates.map(([lng]) => lng);
      const lats = routeGeometry.coordinates.map(([, lat]) => lat);
      map.fitBounds(
        [
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)],
        ],
        {
          padding: fitPadding,
          maxZoom: 15,
          duration: 700,
        },
      );
      return;
    }

    if (places.length === 0) {
      map.flyTo({ center: [PRAGUE_CENTER.longitude, PRAGUE_CENTER.latitude], zoom: 11, duration: 500 });
      return;
    }

    if (places.length === 1) {
      map.flyTo({ center: [places[0].lng, places[0].lat], zoom: 12.5, duration: 500 });
      return;
    }

    const lngs = places.map((place) => place.lng);
    const lats = places.map((place) => place.lat);
    map.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ],
      {
        padding: fitPadding,
        maxZoom: 13,
        duration: 600,
      },
    );
  }, [boundsKey, fitPadding, hasToken, places, routeGeometry, routeKey]);

  if (!hasToken) {
    return (
      <div className="flex h-full min-h-full items-center justify-center bg-[#E8E3DA] p-6 text-center">
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
      ref={mapRef}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{
        ...PRAGUE_CENTER,
        zoom: 12,
      }}
      mapStyle="mapbox://styles/mapbox/light-v11"
      style={{ width: "100%", height: "100%", minHeight: "100%" }}
      attributionControl={false}
      dragPan
      scrollZoom
      touchZoomRotate
      doubleClickZoom
    >
      <NavigationControl position="top-right" />

      {routeGeometry && (
        <Source
          id="active-route"
          type="geojson"
          data={{
            type: "Feature",
            properties: {},
            geometry: routeGeometry,
          }}
        >
          <Layer
            id="active-route-line"
            type="line"
            paint={{
              "line-color": "#C1440E",
              "line-width": 5,
              "line-opacity": 0.9,
            }}
            layout={{
              "line-cap": "round",
              "line-join": "round",
            }}
          />
        </Source>
      )}

      {showPopup && selectedPlace && (
        <Popup
          longitude={selectedPlace.lng}
          latitude={selectedPlace.lat}
          anchor="top"
          closeButton
          closeOnClick={false}
          onClose={onClearSelection}
          offset={16}
          className="poruch-map-popup hidden lg:block"
        >
          <button
            type="button"
            onClick={() => onSelectPlace(selectedPlace)}
            className="max-w-56 text-left"
          >
            <p className="text-sm font-semibold text-neutral-950">{selectedPlace.name}</p>
            <p className="mt-1 text-xs text-neutral-500">{selectedPlace.address}</p>
          </button>
        </Popup>
      )}

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
