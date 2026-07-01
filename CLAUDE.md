# EduMRX App — Claude Code Context

## Qoidalar (o'chirma)
- Package manager: npm
- Tailwind v4 (CSS @theme, config emas)
- Theme: globals.css token (bg-primary, bg-surface, text-foreground...)
- Til: i18n t() har joyda (uz/ru/en), hardcode matn yo'q
- Center: activeCenter/activeBranch → center_id/branch_id params barcha list hook'larda
- API: NEXT_PUBLIC_DataBaseURL env (yo'lda yozma, services/api.ts orqali)
- Dark mode har komponentda
- AI-gradient/binafsha-pushti YO'Q

---

## Arxitektura

**Stack:** Next.js 15 App Router · TypeScript · Tailwind v4 · Zustand · TanStack Query · framer-motion · i18next · react-hook-form + Yup

**Subdomain routing** (`middleware.ts`):
- `director.edumrx.uz` → `app/director/`
- `manager.edumrx.uz` → `app/manager/`
- `teacher/student/parent` → o'z `app/[role]/` papkasi
- `login.edumrx.uz` → login flow
- `edumrx.uz` (subdomain yo'q) → marketing sayt `app/(marketing)/`

**Auth:** Cookie-based, domain=`.edumrx.uz`. Tokenlar: `access_token`, `refresh_token` cookie + localStorage fallback. 401 bo'lsa → `login.edumrx.uz/staff` ga redirect (api.ts interceptor ichida).

**State management:**
- `authStore` — user, tokens, login/logout
- `useUIStore` — theme, accentTheme, language, sidebar, datePickerMode
- `activeCenterStore` — activeCenter (id), activeBranch (id), centerInfo — barcha hook'lar shudan o'qiydi
- TanStack Query — barcha server data (list, detail, mutations)

---

## Muhim pattern'lar

**Center/Branch pattern:** Har bir list hook `activeCenterStore`dan `activeCenter` va `activeBranch` oladi, API'ga `center_id`/`branch_id` params sifatida yuboradi. `branchId` prop berilsa, store'dagi `activeBranch`ni override qiladi.

**API chaqiruv:** `API.get/post/patch/delete(role + "/resurs/", { params })` — role "director" | "manager". Endpoint'lar always: `director/groups/`, `manager/students/` ko'rinishida.

**Hook pattern:** `useXxx.ts` → `useQuery`/`useMutation`. QueryKey'da hamma filter param'lar bo'lishi shart (cache invalidation uchun). `page`, `pageSize`, `search`, `centerId`, `branchId`, `role` — standarт params.

**Form pattern:** Murakkab form'lar `useState` + manual validation (GroupFormModal, StudentFormModal). Oddiy form'larda react-hook-form + Yup.

**i18n:** `public/locales/uz.json`, `en.json`, `ru.json`. Kalit format: `role.section.key`. Yangi kalit qo'shilganda uchala faylga ham qo'shiladi.

**Popup/dropdown:** `position: fixed` + `getBoundingClientRect()` — modal ichidagi picker'lar uchun majburiy (overflow-y: auto scroll bug oldini olish). TimePicker va DatePicker shu pattern'da.

---

## Fayl/papka tuzilishi

```
app/[role]/[feature]/page.tsx   — thin wrapper, faqat View import
views/[role]/XxxView.tsx        — sahifaning asosiy kontenti
components/sections/
  [role]PanelSections/          — feature bo'yicha komponentlar
    groupsView/GroupFormModal.tsx
    navbar/DirectorNav.tsx
components/common/              — shared: Header, GlobalSearchModal, RightDrawer
components/ui/                  — DatePicker, TimePicker, Breadcrumb, ...
hooks/useXxx.ts                 — TanStack Query hooks (1 fayl = 1 resurs)
store/                          — Zustand stores (authStore, useUIStore, activeCenterStore)
types/                          — TS interfeyslari (group.ts, student.ts, ...)
services/api.ts                 — Axios instance + interceptors
public/locales/                 — uz/en/ru JSON
config/                         — director-nav.ts, manager-nav.ts (menyu config)
```

---

## So'nggi sessiyalarda qilingan muhim o'zgarishlar

- **Groups view:** GroupCard (grid), GroupItem (list) — ikkala ko'rinish, GroupsView toggle
- **GroupFormModal:** To'liq forma — kurs/ustoz/xona/status/sana/kun/vaqt/studentlar
- **Student picker (StudentMultiSelect):** Dropdown combobox o'rniga — always-visible list panel, 10/sahifa pagination, checkbox selection, sahifa o'zgarganida tanlangan saqlanib qoladi
- **Group edit pre-populate:** `useGroupDetail` hook (`GET /groups/{id}/`), `useStudentsByGroup` fallback — edit modal ochilganda mavjud studentlar chip sifatida keladi
- **Header:** Profil dropdown (user card, dashboard/profile link, logout) + global student search modal (Ctrl+K, debounce, role-aware navigation)
- **TimePicker + DatePicker:** `position: fixed` popupga o'tkazildi — modal ichida scroll bug yo'q
- **useStudents:** `branchId` override param qo'shildi (store's activeBranch bypass uchun)

---

## Ma'lum cheklovlar / hal qilinmagan

- **`GET /groups/{id}/` response'ida `students` field:** Backend bu fieldni qaytarmasligi mumkin. Hozir ikkita fallback bor: (1) agar `students: IStudent[]` kelsa — to'g'ridan ishlatiladi; (2) agar yo'q/uuid bo'lsa — `GET /students/?group_id=xxx` filter bilan so'rov (backend bu filter'ni qo'llab-quvvatlashi kerak). Agar ikkalasi ham ishlamasa — edit modal'da studentlar bo'sh keladi.
- **PATCH groups'da students=[] (barcha studentni o'chirish):** Edit modal'da barcha studentni olib tashlab save qilsa, students field payload'ga qo'shilmaydi (bo'sh array yuborilmaydi). Hozir `studentsInitialized` true bo'lsa barcha holatda yuboriladi — lekin foydalanuvchi hamma studentni remove qilsa, `studentIds = []` bo'lganda ham to'g'ri yuboriladi (tasdiqlanmagan).
- **`useAttendance`** — FAKE data qaytaradi, real API tayyor emas.
- **`useBranchAnalytics`** — FAKE data qaytaradi, real API tayyor emas.
- **Notifications:** `Header.tsx`da `notifications` array bo'sh `[]` — backend bildirishnoma API hali yo'q.
- **Student detail route:** `app/director/students/{id}/page.tsx` — papka nomi `{id}` (curly braces), Next.js standard'i `[id]`. Routing ishlashi kerak lekin non-standard.
