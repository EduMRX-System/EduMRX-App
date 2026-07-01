// Backend `me/` javobi endi barcha rollar uchun user maydonlarini
// `user_data` ichiga joylaydi, root darajada esa profile-specific
// maydonlar (specialization, salary, center_ids, ...) qoladi.
// Bu funksiya ikkalasini bitta flat obyektga birlashtiradi —
// user_data har doim ustunlik qiladi (id/phone/role kabi asosiy maydonlar uchun).
export function parseMeResponse<T = any>(raw: any): T {
  const { user_data, ...rest } = raw ?? {};
  return { ...rest, ...(user_data ?? {}) } as T;
}
