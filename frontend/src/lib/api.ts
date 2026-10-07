// types/cafe.ts
export interface NomadScores {
  wifi_speed: number;
  power_outlets: number;
  quietness: number;
  overall: number;
}

export interface Cafe {
  id: number;
  name: string;
  slug: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  type: string;
  scores: NomadScores;
  has_power_outlets: boolean;
  is_open_late: boolean;
  price_level: string;
  image_url?: string;
  thumbnail_url?: string;
  desks_available: number;
  total_desks: number;
  ai_insight?: string;
  specialty?: string;
  distance_label?: string;
}

export interface CafeListResponse {
  cafes: Cafe[];
  total: number;
  limit: number;
  offset: number;
  bbox?: any;
}

// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function fetchCafesInBbox(
  sw_lat: number,
  sw_lng: number,
  ne_lat: number,
  ne_lng: number
): Promise<CafeListResponse> {
  const url = new URL(`${API_BASE_URL}/cafes/bbox`);
  url.searchParams.append('sw_lat', sw_lat.toString());
  url.searchParams.append('sw_lng', sw_lng.toString());
  url.searchParams.append('ne_lat', ne_lat.toString());
  url.searchParams.append('ne_lng', ne_lng.toString());

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch cafes');
  }
  return res.json();
}

export async function fetchAllCafes(): Promise<CafeListResponse> {
  const url = new URL(`${API_BASE_URL}/cafes?limit=100`);
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch cafes');
  }
  return res.json();
}
