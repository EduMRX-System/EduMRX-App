export type CourseStatus = "active" | "inactive";

// GET /api/v1/director/courses/  (DRF pagination)
export interface Course {
    id: string;
    name: string;
    description: string;
    duration_months: number;
    price: string; // decimal string, masalan "551"
    status: CourseStatus;
    created_at: string;
}

export interface CoursesResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Course[];
}

// POST / PATCH payload
export interface CoursePayload {
    name: string;
    description: string;
    duration_months: number;
    price: string;
    status: CourseStatus;
}

export const STATUS_OPTIONS: { value: CourseStatus; label: string; color: string }[] = [
    { value: "active", label: "Faol", color: "bg-emerald-500" },
    { value: "inactive", label: "Nofaol", color: "bg-rose-500" },
];

export function formatPrice(price?: string | number | null): string {
    if (price == null || price === "") return "—";
    const n = Number(price);
    if (Number.isNaN(n)) return String(price);
    return new Intl.NumberFormat("uz-UZ").format(n) + " so'm";
}