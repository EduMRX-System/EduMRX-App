export interface ManagerUser {
    id: string;
    phone: string;
    first_name: string;
    last_name: string;
    full_name: string;
    avatar?: string | null;
    email: string;
}

// GET /api/v1/director/admins/ (DRF) — manager = admin
export interface IManager {
    id: string;
    user: ManagerUser;
    center?: string;        // FK id (GET'da bor)
    center_name?: string;
    notes?: string;
    created_at?: string;
}

// POST / PATCH payload — FK nomi: center
export interface ManagerPayload {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    password?: string;     // add'da majburiy, edit'da ixtiyoriy
    avatar?: string;
    center: string;        // branch id
    notes?: string;
}

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