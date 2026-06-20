export interface TeacherUser {
  id: string;
  phone: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar?: string | null;
  email: string;
}

// GET /api/v1/director/teachers/ (DRF) — user nested
export interface ITeacher {
  id: string;
  user: TeacherUser;
  specialization?: string;
  experience?: number;
  salary?: string;
  created_at?: string;

  // edit prefill / back-compat (GET'da bo'lmasligi mumkin):
  centers?: string;
  center?: string;
  center_id?: string;
  center_name?: string;
  branch?: string;
  bio?: string;
  date_of_birth?: string;
}

// POST (add) / PUT (edit) payload — flat. password faqat add'da.
export interface TeacherPayload {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  password?: string;
  centers: string; // branch id shu yerga yuboriladi
  specialization: string;
  experience: number;
  salary: string;
  bio: string;
  date_of_birth: string;
}

// "998901234567" -> "+998 (90) 123-45-67"
export function formatPhoneView(phone?: string): string {
  if (!phone) return "—";
  const c = phone.replace(/\D/g, "");
  if (c.length === 12) {
      return `+998 (${c.slice(3, 5)}) ${c.slice(5, 8)}-${c.slice(8, 10)}-${c.slice(10)}`;
  }
  return phone;
}

// local raqamlar -> "90-123-45-67"
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