// ── TURLAR (TYPES) VA INTERFEYSLAR (INTERFACES) ──

export type StudentStatus =
  | "active"
  | "inactive"
  | "pending"
  | "frozen"
  | "new"
  | "graduated"
  | "suspended";

export type StudentSex = "male" | "female";

// Foydalanuvchining shaxsiy ma'lumotlari (yangi API strukturasiga asosan)
export interface IUserInfo {
  id: string;
  phone: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  avatar?: string | null;
  date_of_birth?: string;
  sex?: StudentSex;
}

// GET /api/v1/director/students/
export interface IStudent {
  id: string;
  user: {
    id: string;
    phone: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string | null;
    role: "student";
    sex: StudentSex;
  };
  center: string;
  center_name: string;
  branch: string;
  branch_name: string;
  parent: string | null;
  parent_name: string | null;
  parent_phone: string | null;
  status: StudentStatus;
  date_of_birth: string;
  enrolled_at: string;
  notes: string;
}

// POST (add) / PUT (edit) payload
export interface StudentPayload {
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  sex: StudentSex;
  parent_phone: string;
  password?: string; // faqat add uchun majburiy
  center: string; // branch id
  date_of_birth: string;
  notes?: string;
  status: StudentStatus;
}

// ── O'ZGARMAS QIYMATLAR (CONSTANTS) ──

export const STATUS_OPTIONS: {
  value: StudentStatus;
  label: string;
  color: string;
}[] = [
  { value: "active", label: "Faol", color: "bg-emerald-500" }, // Yaxshi, faol holat (Yashil)
  { value: "inactive", label: "Nofaol", color: "bg-slate-400" }, // Passiv, neytral holat (Och kulrang)
  { value: "frozen", label: "Muzlatilgan", color: "bg-sky-400" }, // Muzlatilgan (Havorang/Muz rangi)
  { value: "new", label: "Yangi", color: "bg-amber-500" }, // Yangi, e'tibor tortuvchi (Sariq/Olovrang)
  { value: "graduated", label: "Bitirgan", color: "bg-indigo-500" }, // Muvaffaqiyatli tugatgan (To'q ko'k/Siyohrang)
  { value: "suspended", label: "To`xtatgan", color: "bg-rose-500" }, // Jiddiy to'xtatilish yoki xato (Qizil)
];

// ── YORDAMCHI FUNKSIYALAR (HELPERS) ──

export function formatPhoneView(phone?: string): string {
  if (!phone) return "—";
  const c = phone.replace(/\D/g, "");
  // Masalan: 998901234567 formatida kelsa:
  if (c.length === 12) {
    return `+998 (${c.slice(3, 5)}) ${c.slice(5, 8)}-${c.slice(8, 10)}-${c.slice(10)}`;
  }
  return phone;
}

export function formatUzPhone(raw: string): string {
  const d = raw.replace(/\D/g, "").replace(/^998/, "").slice(0, 9);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}-${d.slice(2, 5)}`;
  if (d.length <= 7)
    return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5, 7)}`;
  return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5, 7)}-${d.slice(7)}`;
}

export function splitFullName(full?: string): { first: string; last: string } {
  const parts = (full ?? "").trim().split(/\s+/).filter(Boolean);
  return {
    first: parts[0] ?? "",
    last: parts.slice(1).join(" "),
  };
}
