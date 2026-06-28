"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import { cn } from "@/lib/utils";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  isValidLatLng,
  OSM_ATTRIBUTION,
  OSM_TILE_URL,
} from "@/lib/map/constants";
import { createMarkerIcon, createPickerIcon, loadLeaflet } from "@/lib/map/leaflet";

export type MapViewMarker = {
  id: string;
  lat: number;
  lng: number;
  label?: string;
};

type MapViewProps = {
  markers?: MapViewMarker[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  className?: string;
  selectedId?: string | null;
  onMarkerClick?: (id: string) => void;
  pickMode?: boolean;
  pickLatLng?: { lat: number; lng: number } | null;
  onPick?: (lat: number, lng: number) => void;
  fitToMarkers?: boolean;
  scrollWheelZoom?: boolean;
};

export function MapView({
  markers = [],
  center,
  zoom = DEFAULT_MAP_ZOOM,
  height = "320px",
  className,
  selectedId,
  onMarkerClick,
  pickMode = false,
  pickLatLng,
  onPick,
  fitToMarkers = false,
  scrollWheelZoom = true,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Map<string, LeafletMarker>>(new Map());
  const pickMarkerRef = useRef<LeafletMarker | null>(null);
  const onPickRef = useRef(onPick);
  const onMarkerClickRef = useRef(onMarkerClick);

  onPickRef.current = onPick;
  onMarkerClickRef.current = onMarkerClick;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;

    (async () => {
      const L = await loadLeaflet();
      if (cancelled || !containerRef.current) return;

      const initialCenter: [number, number] =
        pickLatLng && isValidLatLng(pickLatLng.lat, pickLatLng.lng)
          ? [pickLatLng.lat, pickLatLng.lng]
          : center ?? DEFAULT_MAP_CENTER;

      const map = L.map(containerRef.current, {
        center: initialCenter,
        zoom,
        scrollWheelZoom,
      });

      L.tileLayer(OSM_TILE_URL, { attribution: OSM_ATTRIBUTION }).addTo(map);

      if (pickMode) {
        map.on("click", (e) => {
          onPickRef.current?.(e.latlng.lat, e.latlng.lng);
        });
      }

      mapRef.current = map;
      setTimeout(() => map.invalidateSize(), 100);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current.clear();
      pickMarkerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init once
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    void loadLeaflet().then((L) => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();

      if (pickMode) return;

      markers.forEach((point) => {
        if (!isValidLatLng(point.lat, point.lng)) return;

        const marker = L.marker([point.lat, point.lng], {
          icon: createMarkerIcon(L, point.id === selectedId),
        }).addTo(map);

        if (point.label) {
          marker.bindTooltip(point.label, {
            direction: "top",
            offset: [0, -24],
            opacity: 0.95,
          });
        }

        if (onMarkerClickRef.current) {
          marker.on("click", () => onMarkerClickRef.current?.(point.id));
        }

        markersRef.current.set(point.id, marker);
      });

      if (fitToMarkers && markers.length > 0) {
        const valid = markers.filter((m) => isValidLatLng(m.lat, m.lng));
        if (valid.length === 1) {
          map.setView([valid[0].lat, valid[0].lng], Math.max(zoom, 8));
        } else if (valid.length > 1) {
          const bounds = L.latLngBounds(valid.map((m) => [m.lat, m.lng] as [number, number]));
          map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
        }
      }
    });
  }, [markers, selectedId, pickMode, fitToMarkers, zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !pickMode) return;

    void loadLeaflet().then((L) => {
      if (pickMarkerRef.current) {
        pickMarkerRef.current.remove();
        pickMarkerRef.current = null;
      }

      if (pickLatLng && isValidLatLng(pickLatLng.lat, pickLatLng.lng)) {
        const marker = L.marker([pickLatLng.lat, pickLatLng.lng], {
          icon: createPickerIcon(L),
          draggable: true,
        }).addTo(map);

        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          onPickRef.current?.(pos.lat, pos.lng);
        });

        pickMarkerRef.current = marker;
        map.setView([pickLatLng.lat, pickLatLng.lng], Math.max(map.getZoom(), 6), {
          animate: true,
        });
      }
    });
  }, [pickLatLng, pickMode]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const timer = window.setTimeout(() => map.invalidateSize(), 150);
    return () => window.clearTimeout(timer);
  }, [pickLatLng, markers, center, pickMode]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || pickMode) return;
    if (center) {
      map.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, pickMode]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border-subtle bg-border-subtle/30",
        className
      )}
      style={{ height }}
    >
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
