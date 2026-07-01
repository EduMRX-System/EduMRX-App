export type CenterStatus = "active" | "inactive" | "suspended" | string;
export type CenterPlan = "trial" | "basic" | "pro" | string;

// GET javob strukturasi (super-admin panelidagi Center bilan bir xil)
export interface ICenter {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  phone: string;
  email: string;
  address: string;
  longitude: string;
  latitude: string;
  status: CenterStatus;
  plan: CenterPlan;
  director: string;
  director_name: string;
  students_count: number;
  subscription_expires: string;
}

// PATCH payload — faqat tahrirlanadigan maydonlar.
// slug/status/plan/director/director_name/students_count/subscription_expires — faqat o'qish uchun.
export interface CenterPayload {
  name: string;
  phone: string;
  email: string;
  address: string;
  longitude: string;
  latitude: string;
  logo?: File | null;
}
