import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

interface ProfileResponse {
  ok: boolean;
  profile: User;
}
interface UseUserProps {
  user: User;
  isLoading: boolean;
}

export default function useUser(): UseUserProps {
  const { data, error } = useSWR<ProfileResponse>("/api/users/me");
  const router = useRouter();
  useEffect(() => {
    if (data && !data.ok) {
      router.push("/login");
    }
  }, [data, router]);

  const user = Object(data?.profile);

  return { user, isLoading: !data && !error };
}
