"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ExternalLink, MapPin } from "lucide-react";
import { useSiteContent } from "@/context/SiteContentContext";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import {
  DETAIL_MAP_ZOOM,
  formatCoordinates,
  googleMapsUrl,
  isValidLatLng,
} from "@/lib/map/constants";
import type { MapPointItem } from "@/types/cms";

const MapView = dynamic(
  () => import("@/components/map/MapView").then((m) => m.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-2xl bg-border-subtle/40 lg:min-h-[400px]">
        <Spinner size="lg" label="جاري تحميل الخريطة..." />
      </div>
    ),
  }
);

export function ProjectMapSection() {
  const { mapPoints, sectionTitles, text } = useSiteContent();
  const points = mapPoints.filter((p) => p.enabled && isValidLatLng(p.lat, p.lng));
  const [selected, setSelected] = useState<MapPointItem | null>(null);

  const markers = useMemo(
    () =>
      points.map((point) => ({
        id: point.id,
        lat: point.lat,
        lng: point.lng,
        label: text(point.name),
      })),
    [points, text]
  );

  useEffect(() => {
    if (selected && !points.some((p) => p.id === selected.id)) {
      setSelected(null);
    }
  }, [points, selected]);

  const detailCenter = selected
    ? ([selected.lat, selected.lng] as [number, number])
    : undefined;

  return (
    <section id="map" className="section-padding bg-surface">
      <div className="container-dif">
        <SectionHeader
          title={text(sectionTitles.map)}
          subtitle={text(sectionTitles.mapSubtitle)}
        />

        <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
          <Card className="col-span-1 overflow-hidden !p-0 lg:col-span-2">
            <MapView
              markers={markers}
              selectedId={selected?.id ?? null}
              onMarkerClick={(id) => {
                const point = points.find((p) => p.id === id) ?? null;
                setSelected(point);
              }}
              fitToMarkers={!selected}
              center={detailCenter}
              zoom={selected ? DETAIL_MAP_ZOOM : undefined}
              height="min(60vh, 420px)"
              className="rounded-none border-0"
            />
          </Card>

          <Card className="flex flex-col justify-center">
            {selected ? (
              <div>
                <h3 className="text-lg font-bold">{text(selected.name)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text(selected.country)}</p>
                <p className="mt-1 text-xs text-muted-foreground" dir="ltr">
                  {formatCoordinates(selected.lat, selected.lng)}
                </p>

                <div className="mt-4 overflow-hidden rounded-2xl border border-border-subtle">
                  <MapView
                    markers={[
                      {
                        id: selected.id,
                        lat: selected.lat,
                        lng: selected.lng,
                        label: text(selected.name),
                      },
                    ]}
                    center={[selected.lat, selected.lng]}
                    zoom={DETAIL_MAP_ZOOM}
                    height="160px"
                    className="rounded-none border-0"
                  />
                </div>

                <Link
                  href={googleMapsUrl(selected.lat, selected.lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  فتح في Google Maps
                </Link>
              </div>
            ) : (
              <div className="flex min-h-[180px] flex-col items-center justify-center text-center text-muted-foreground lg:min-h-[200px]">
                <MapPin className="mb-3 h-10 w-10 opacity-40" />
                <p className="text-sm">{text(sectionTitles.mapHint)}</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}
