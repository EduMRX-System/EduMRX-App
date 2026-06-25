// GET /api/v1/director/rooms/ (DRF pagination)
export interface Room {
    id: string;
    name: string;
    capacity: number;
    center?: string;
    branch?: string;
    branch_name?: string;
}

export interface RoomsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Room[];
}

// POST / PATCH payload
export interface RoomPayload {
    name: string;
    capacity: number;
    center: string;
    branch: string;
}