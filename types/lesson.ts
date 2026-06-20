// GET /api/v1/director/lessons/ (DRF pagination)
export interface Lesson {
    id: string;
    group: string;       // FK id
    group_name: string;
    date: string;        // "2026-06-20"
    start_time: string;  // "13:50:49.093Z"
    end_time: string;
    topic: string;
    notes: string;
}

export interface LessonsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Lesson[];
}

// POST / PATCH payload
export interface LessonPayload {
    group: string;
    date: string;
    start_time: string;  // "HH:MM"
    end_time: string;
    topic: string;
    notes: string;
}

// "13:50:49.093Z" / "13:50" -> "13:50"
export function toHHMM(raw?: string | null): string {
    if (!raw) return "";
    return raw.slice(0, 5);
}