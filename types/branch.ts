export type BranchStatus = "active" | "inactive";

export interface BranchStats {
  students_count: number;
  teachers_count: number;
  rooms_count: number;
}

// GET /api/v1/center/branches/ — item
export interface Branch {
  id: string;
  name: string;
  status: BranchStatus;
  address: string;
  phone: string;
  coordinates: [number, number] | string | null; // backend [lat, lng] array qaytaradi
  manager: string | null;
  stats: BranchStats | null;
  created_at: string;
}

// Backend javobi: { status, count, data: [...] }  (DRF pagination EMAS)
export interface BranchesResponse {
  status: string;
  count: number;
  data: Branch[];
}

// POST / PATCH payload — coordinates [lat, lng]
export interface BranchPayload {
  name: string;
  address: string;
  phone: string;
  coordinates: [number, number];
  status: BranchStatus;
}

// coordinates -> { lat, lng } string (array yoki "lat,lng" string'ni ham qo'llaydi)
export function parseCoordinates(
  raw?: [number, number] | string | null,
): { lat: string; lng: string } | null {
  if (!raw) return null;
  let lat: number, lng: number;
  if (Array.isArray(raw)) {
    [lat, lng] = raw;
  } else {
    const parts = raw.split(",").map((p) => Number(p.trim()));
    if (parts.length !== 2) return null;
    [lat, lng] = parts;
  }
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat: String(lat), lng: String(lng) };
}
