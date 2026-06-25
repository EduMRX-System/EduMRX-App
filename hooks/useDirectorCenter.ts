import { useActiveCenterStore } from "@/store/activeCenterStore";
import { useAuthStore } from "@/store/authStore";

export interface DirectorCenter {
  id: string;
  name: string;
}

/**
 * Returns the currently active center from the Zustand store.
 * useActiveCenters() must be mounted (e.g. in Header) to populate the store.
 */
export function useDirectorCenter() {
  const { user } = useAuthStore();
  const { activeCenter, centers, isCentersLoaded } = useActiveCenterStore();

  const isLoading = !!user && !isCentersLoaded;
  const data: DirectorCenter | null = isCentersLoaded
    ? (centers.find((c) => c.id === activeCenter) ?? null)
    : null;

  return { data, isLoading };
}
