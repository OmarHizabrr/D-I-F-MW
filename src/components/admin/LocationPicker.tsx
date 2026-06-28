"use client";

import { useCallback, useEffect, useState } from "react";
import { LocateFixed, MapPin, Search } from "lucide-react";
import { MapView } from "@/components/map/MapView";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  DEFAULT_MAP_CENTER,
  isValidLatLng,
  formatCoordinates,
  PICKER_MAP_ZOOM,
} from "@/lib/map/constants";
import { reverseGeocode, searchPlaces, type GeocodeResult } from "@/lib/map/geocode";

type LocationPickerProps = {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
};

export function LocationPicker({ lat, lng, onChange }: LocationPickerProps) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [placeLabel, setPlaceLabel] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  const pickLatLng = isValidLatLng(lat, lng) ? { lat, lng } : null;

  const updateLocation = useCallback(
    async (nextLat: number, nextLng: number) => {
      onChange(nextLat, nextLng);
      const label = await reverseGeocode(nextLat, nextLng);
      setPlaceLabel(label);
    },
    [onChange]
  );

  useEffect(() => {
    if (!pickLatLng) return;
    void reverseGeocode(pickLatLng.lat, pickLatLng.lng).then(setPlaceLabel);
  }, [pickLatLng]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim()) return;
    setSearching(true);
    try {
      const found = await searchPlaces(search);
      setResults(found);
    } finally {
      setSearching(false);
    }
  }

  function selectResult(result: GeocodeResult) {
    void updateLocation(result.lat, result.lng);
    setResults([]);
    setSearch(result.label.split(",").slice(0, 2).join(", "));
  }

  function handleUseMyLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        void updateLocation(pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Input
            label="بحث عن موقع"
            dir="auto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="مثال: صنعاء، اليمن أو Malawi"
            hint="ابحث بالمدينة أو الدولة أو اسم المكان"
          />
        </div>
        <Button
          type="submit"
          variant="secondary"
          className="mt-6 shrink-0"
          loading={searching}
          loadingText="..."
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {results.length > 0 && (
        <ul className="max-h-40 overflow-y-auto rounded-xl border border-border-subtle bg-surface text-sm shadow-sm">
          {results.map((result) => (
            <li key={`${result.lat}-${result.lng}-${result.label}`}>
              <button
                type="button"
                onClick={() => selectResult(result)}
                className="flex w-full items-start gap-2 px-3 py-2.5 text-start hover:bg-brand-green/5"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                <span className="line-clamp-2">{result.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <MapView
        pickMode
        pickLatLng={pickLatLng ?? { lat: DEFAULT_MAP_CENTER[0], lng: DEFAULT_MAP_CENTER[1] }}
        onPick={updateLocation}
        zoom={pickLatLng ? Math.max(PICKER_MAP_ZOOM, 6) : PICKER_MAP_ZOOM}
        height="min(52vh, 320px)"
        scrollWheelZoom
      />

      <p className="text-xs text-muted-foreground">
        انقر على الخريطة أو اسحب الدبوس لتحديد الموقع بدقة
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Latitude (خط العرض)"
          type="number"
          dir="ltr"
          step="any"
          value={Number.isFinite(lat) ? lat : ""}
          onChange={(e) => void updateLocation(Number(e.target.value), lng)}
        />
        <Input
          label="Longitude (خط الطول)"
          type="number"
          dir="ltr"
          step="any"
          value={Number.isFinite(lng) ? lng : ""}
          onChange={(e) => void updateLocation(lat, Number(e.target.value))}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          loading={locating}
          loadingText="جاري التحديد..."
          onClick={handleUseMyLocation}
        >
          <LocateFixed className="h-4 w-4" />
          موقعي الحالي
        </Button>
        {pickLatLng && (
          <p className="text-xs text-muted-foreground" dir="ltr">
            {formatCoordinates(pickLatLng.lat, pickLatLng.lng)}
          </p>
        )}
      </div>

      {placeLabel && (
        <p className="rounded-xl bg-brand-green/5 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
          {placeLabel}
        </p>
      )}
    </div>
  );
}
