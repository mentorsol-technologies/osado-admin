import { useGetCurrentUserQuery } from "@/hooks/useUsersMutations";
import { useAuthStore } from "@/app/store/authStore";
import { SubAdminPermission } from "@/types/subAdmin";

// GET /users/me returns { data: [user] } (ReadUserArrayResponseDto), already
// unwrapped once by the axios interceptor - this hook unwraps the array too
// and derives the role/permission helpers every permission-gated UI needs.
export const useCurrentUserAccess = () => {
  const query = useGetCurrentUserQuery();
  const { role: seededRole } = useAuthStore();

  const user = (query.data as any)?.data?.[0];
  const fetchedRole: string | undefined = user?.role?.role;
  // The sign-in response already carries the role, seeded into the auth
  // store at login - fall back to that while /users/me is still loading, so
  // an admin doesn't have to wait on a round-trip just to see the full menu.
  const role = fetchedRole ?? seededRole ?? undefined;
  const permissions: string[] = user?.permissions ?? [];
  const isAdmin = role === "admin";

  // A sub-admin's permissions only ever come from /users/me - no seeded
  // shortcut for them, so they still wait on the real fetch.
  const isLoading = isAdmin ? false : query.isLoading;

  return {
    ...query,
    isLoading,
    user,
    role,
    permissions,
    isAdmin,
    // Admin always passes, regardless of the permissions array.
    hasPermission: (permission: SubAdminPermission) =>
      isAdmin || permissions.includes(permission),
  };
};
