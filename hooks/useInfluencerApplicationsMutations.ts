import { useQuery } from "@tanstack/react-query";
import { GetInfluencerApplications } from "@/services/influencer-applications/influencerApplicationsServices";

// Fetches all influencer applications for the admin dashboard table. Status
// filtering/search/pagination is handled client-side by CommonTable, so we
// pull a generous page here.
export const useInfluencerApplicationsQuery = () => {
  return useQuery({
    queryKey: ["influencerApplications"],
    queryFn: () => GetInfluencerApplications({ limit: 100 }),
  });
};
