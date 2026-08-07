import { useQuery } from "@tanstack/react-query";
import { GetInfluencerApplications } from "@/services/influencer-applications/influencerApplicationsServices";

// Fetches influencer applications for the admin dashboard table. Status
// filtering/search happen client-side by CommonTable within whatever page is
// loaded; pagination itself is real (server page/limit), so applications
// beyond the first page are still reachable.
export const useInfluencerApplicationsQuery = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["influencerApplications", page, limit],
    queryFn: () => GetInfluencerApplications({ page, limit }),
  });
};
