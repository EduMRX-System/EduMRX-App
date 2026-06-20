export type StudentStatus = "active" | "inactive" | "pending";

// GET /api/v1/director/students/ — flat
export interface IStudent {
    id: string;
    student_id?: string;
    full_name: string;
    first_name?: string;
    last_name?: string;
    avatar?: string | null;
    phone: string;
    email: string;
    center?: string;        // FK id (GET'da bo'lmasligi mumkin)
    center_name?: string;
    date_of_birth?: string;
    notes?: string;
    status?: StudentStatus;
    enrolled_at?: string;
}

// POST (add) / PUT (edit) payload — FK nomi: center
export interface StudentPayload {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    password?: string;     // faqat add
    center: string;        // branch id
    date_of_birth: string;
    notes?: string;
    status: "active" | "inactive";
}

export const STATUS_OPTIONS: { value: "active" | "inactive"; label: string; color: string }[] = [
    { value: "active", label: "Faol", color: "bg-emerald-500" },
    { value: "inactive", label: "Nofaol", color: "bg-rose-500" },
];

export function formatPhoneView(phone?: string): string {
    if (!phone) return "—";
    const c = phone.replace(/\D/g, "");
    if (c.length === 12) {
        return `+998 (${c.slice(3, 5)}) ${c.slice(5, 8)}-${c.slice(8, 10)}-${c.slice(10)}`;
    }
    return phone;
}

export function formatUzPhone(raw: string): string {
    const d = raw.replace(/\D/g, "").replace(/^998/, "").slice(0, 9);
    if (d.length <= 2) return d;
    if (d.length <= 5) return `${d.slice(0, 2)}-${d.slice(2, 5)}`;
    if (d.length <= 7) return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5, 7)}`;
    return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5, 7)}-${d.slice(7)}`;
}

export function splitFullName(full?: string): { first: string; last: string } {
    const parts = (full ?? "").trim().split(/\s+/).filter(Boolean);
    return { first: parts[0] ?? "", last: parts.slice(1).join(" ") };
}