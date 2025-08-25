import { authApi } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: authApi.validateSession,
    retry: false, // don’t retry on 401
    staleTime: 1000 * 60, // 1 min cache
  });
}
