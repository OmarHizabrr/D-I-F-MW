export type GeocodeResult = {
  lat: number;
  lng: number;
  label: string;
};

export async function searchPlaces(query: string): Promise<GeocodeResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", trimmed);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "8");
  url.searchParams.set("addressdetails", "0");

  const res = await fetch(url.toString(), {
    headers: {
      "Accept-Language": "ar,en",
    },
  });

  if (!res.ok) return [];

  const data = (await res.json()) as Array<{
    lat: string;
    lon: string;
    display_name: string;
  }>;

  return data.map((item) => ({
    lat: Number(item.lat),
    lng: Number(item.lon),
    label: item.display_name,
  }));
}

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lng));
  url.searchParams.set("format", "json");

  const res = await fetch(url.toString(), {
    headers: { "Accept-Language": "ar,en" },
  });

  if (!res.ok) return null;

  const data = (await res.json()) as { display_name?: string };
  return data.display_name ?? null;
}
