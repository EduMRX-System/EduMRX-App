// Markazlashtirilgan TanStack Query key factory.
// Maqsad: bir xil resurs (masalan students) turli joylarda turli xil
// query key bilan so'ralib, cache qayta ishlatilmay qolishining oldini olish.
// Har bir resurs uchun key shu yerda yaratiladi — hook yoki component ichida
// queryKey massivini qo'lda yozish o'rniga shu factorydan foydalaniladi.

type Role = "director" | "manager";

export const queryKeys = {
  students: {
    listAll: ["students-list"] as const,
    list: (params: { page: number; pageSize: number; search: string; centerId: string | null; branchId: string | null; role: Role }) =>
      ["students-list", params] as const,
    search: (params: { search: string; centerId: string | null; branchId: string | null; role: Role }) =>
      ["student-search", params] as const,
    byGroup: (groupId: string | undefined, role: Role, centerId: string | null, branchId: string | null) =>
      ["students-by-group", groupId, role, centerId, branchId] as const,
    // Inline "select ichida qidiruv" picker'lar (masalan Payments/Debts formalaridagi
    // studentni tanlash) uchun — hammasi shu keydan foydalansa, bir xil
    // search+center bo'yicha so'rov faqat bir marta tarmoqqa boradi.
    searchOptions: (params: { search: string; centerId: string | null; role: Role }) =>
      ["student-search-options", params] as const,
  },

  groups: {
    all: ["groups"] as const,
    list: (params: { page: number; pageSize: number; search: string; centerId: string | null; branchId: string | null; role: Role }) =>
      ["groups", params] as const,
    detail: (id: string | undefined, role: Role, centerId: string | null) =>
      ["group-detail", id, role, centerId] as const,
    options: (centerId: string | null, branchId: string | null, role: Role) =>
      ["groups", "options", centerId, branchId, role] as const,
    searchOptions: (params: { search: string; centerId: string | null; role: Role }) =>
      ["group-search-options", params] as const,
  },

  teachers: {
    all: ["teachers"] as const,
    list: (params: { page: number; pageSize: number; search: string; centerId: string | null; branchId: string | null; role: Role }) =>
      ["teachers", params] as const,
    options: (centerId: string | null, branchId: string | null, role: Role) =>
      ["teacher", "options", centerId, branchId, role] as const,
  },

  rooms: {
    all: ["rooms"] as const,
    list: (params: { page: number; pageSize: number; search: string; centerId: string | null; branchId: string | null; role: Role }) =>
      ["rooms", params] as const,
    capacities: (centerId: string | null, branchId: string | null, role: Role) =>
      ["room-capacities", { centerId, branchId, role }] as const,
    options: (centerId: string | null, branchId: string | null, role: Role) =>
      ["room", "options", centerId, branchId, role] as const,
  },

  courses: {
    all: ["courses"] as const,
    list: (params: { page: number; pageSize: number; search: string; centerId: string | null; branchId: string | null; role: Role }) =>
      ["courses", params] as const,
    options: (centerId: string | null, branchId: string | null, role: Role) =>
      ["course", "options", centerId, branchId, role] as const,
  },

  branches: {
    all: ["branches"] as const,
    list: (params: { page: number; pageSize: number; search: string; centerId: string | null }) =>
      ["branches", params] as const,
    options: (centerId: string | null) => ["branches", "options", centerId] as const,
    forCenter: (centerId: string | null) => ["branches-for-center", centerId] as const,
  },

  centers: {
    // "director-centers" (hooks/useActiveScope.ts) — yengil ro'yxat, shu yerga tegilmadi.
    detail: (centerId: string | null) => ["center-detail", centerId] as const,
  },

  managers: {
    all: ["managers"] as const,
    list: (params: { page: number; pageSize: number; search: string; centerId: string | null; branchId: string | null }) =>
      ["managers", params] as const,
  },

  lessons: {
    all: ["lessons"] as const,
    list: (params: { page: number; pageSize: number; search: string; date: string | undefined; centerId: string | null; branchId: string | null; role: Role }) =>
      ["lessons", params] as const,
  },

  payments: {
    listAll: ["payments-list"] as const,
    list: (params: { page: number; pageSize: number; search: string; status: string; method: string; centerId: string | null; branchId: string | null }) =>
      ["payments-list", params] as const,
    summaryAll: ["payments-summary"] as const,
    summary: (centerId: string | null, branchId: string | null) =>
      ["payments-summary", { centerId, branchId }] as const,
  },

  debts: {
    listAll: ["debts-list"] as const,
    list: (params: { page: number; pageSize: number; search: string; status: string; centerId: string | null; branchId: string | null }) =>
      ["debts-list", params] as const,
    summaryAll: ["debts-summary"] as const,
    summary: (centerId: string | null, branchId: string | null) =>
      ["debts-summary", { centerId, branchId }] as const,
  },

  expenses: {
    listAll: ["expenses-list"] as const,
    list: (params: { page: number; pageSize: number; search: string; status: string; category: string; centerId: string | null; branchId: string | null }) =>
      ["expenses-list", params] as const,
    summaryAll: ["expenses-summary"] as const,
    summary: (centerId: string | null, branchId: string | null) =>
      ["expenses-summary", { centerId, branchId }] as const,
    categoriesAll: ["expense-categories"] as const,
    categories: (centerId: string | null) => ["expense-categories", centerId] as const,
  },
} as const;
