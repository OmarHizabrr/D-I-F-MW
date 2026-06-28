import type { DivIcon } from "leaflet";

export type LeafletModule = typeof import("leaflet");

export async function loadLeaflet(): Promise<LeafletModule> {
  return import("leaflet");
}

export function createMarkerIcon(L: LeafletModule, active = false): DivIcon {
  const color = active ? "#5c7622" : "#7a9a2e";
  const pulse = active ? `<span class="dif-map-marker-pulse"></span>` : "";

  return L.divIcon({
    className: "dif-map-marker-wrap",
    html: `
      <span class="dif-map-marker">
        ${pulse}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="${color}" stroke="white" stroke-width="1.5">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5" fill="white"/>
        </svg>
      </span>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

export function createPickerIcon(L: LeafletModule): DivIcon {
  return createMarkerIcon(L, true);
}
