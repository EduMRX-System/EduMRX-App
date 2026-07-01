import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/services/api";
import type { ICenter, CenterPayload } from "@/types/center";
import { queryKeys } from "@/lib/queryKeys";

function mapCenter(c: any): ICenter {
  return {
    id: String(c.id),
    name: c.name ?? "",
    slug: c.slug ?? "",
    logo: c.logo ?? null,
    phone: c.phone ?? "",
    email: c.email ?? "",
    address: c.address ?? "",
    longitude: c.longitude != null ? String(c.longitude) : "",
    latitude: c.latitude != null ? String(c.latitude) : "",
    status: c.status ?? "active",
    plan: c.plan ?? "trial",
    director: c.director ?? "",
    director_name: c.director_name ?? "",
    students_count: c.students_count ?? 0,
    subscription_expires: c.subscription_expires ?? "",
  };
}

export function useCenterDetail(centerId: string | null) {
  return useQuery<ICenter | null>({
    queryKey: queryKeys.centers.detail(centerId),
    queryFn: async () => {
      // Hozircha director uchun alohida "GET /centers/{id}/" tasdiqlangan endpoint yo'q —
      // director/analytics/centers/ ro'yxatidan mos id topiladi (u yerdagi obyekt
      // to'liq Center strukturasini qaytaradi). Backend alohida detail endpoint
      // chiqarsa, shu queryFn ichini o'sha GET'ga almashtirish kifoya.
      const res = await API.get("director/analytics/centers/");
      const list = Array.isArray(res.data) ? res.data : (res.data?.results ?? res.data?.data ?? []);
      const found = list.find((c: any) => String(c.id) === centerId);
      return found ? mapCenter(found) : null;
    },
    enabled: !!centerId,
  });
}

export function useUpdateCenter(centerId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CenterPayload) => {
      const fd = new FormData();
      fd.append("name", payload.name);
      fd.append("phone", payload.phone);
      fd.append("email", payload.email);
      fd.append("address", payload.address);
      fd.append("longitude", payload.longitude);
      fd.append("latitude", payload.latitude);
      if (payload.logo instanceof File) fd.append("logo", payload.logo);

      // TODO: backend'da director uchun "markazni tahrirlash" PATCH endpointi hali yo'q.
      // Endpoint tayyor bo'lgach shu so'rov to'g'ridan-to'g'ri ishlab ketadi — boshqa
      // hech narsa o'zgartirish shart emas (standart REST konventsiyasiga mos yozilgan:
      // boshqa resurslar ham `director/<resurs>/{id}/` shaklida PATCH qilinadi).
      const res = await API.patch(`director/centers/${centerId}/`, fd);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.centers.detail(centerId) });
      qc.invalidateQueries({ queryKey: ["director-centers"] });
    },
  });
}
