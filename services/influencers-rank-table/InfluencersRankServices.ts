

import api from "@/lib/axios";

export const getInfluencersRank = async () => {
    const response = await api.get("/influencer-rank");
    return response.data;
};

export const createInfluencersRank = async (data: any) => {
    const response = await api.post("/influencer-rank", data);
    return response;
};
// ✅ Update influencers
export const updateInfluencersRank = async (rankId: string | number, data: any) => {
    const response = await api.patch(`/influencer-rank/${rankId}`, data);
    return response;
};

// ✅ Delete a influencers
export const deleteInfluencersRank = async (id: number) => {
    const response = await api.delete(`/influencer-rank/${id}`);
    return response;
};

export const getInfluencersRankUploadLink = async (fileType: string) => {
  const response = await api.post("/influencer-rank/upload-link?linkType=icon", { fileType });
  const data = response.data ?? response;
  if (!data?.url || !data?.fields) throw new Error("Upload link missing URL or fields");
  return data; 
};


