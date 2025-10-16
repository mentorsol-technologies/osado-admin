import api from "@/lib/axios";



export const createBanner = async (data: any) => {
    const response = await api.post("/banners", data);
    return response;
};

// Get All SubCategories
export const getBanner = async () => {
    const response = await api.get("/banners");
    return response.data;
};

export const updateBanner = async (id: string | number, data: any,) => {
    const response = await api.patch(`/banners/${id}`, data);
    return response;
};

export const suspendedBanner = async (id: string | number, data: any,) => {
    const response = await api.patch(`/banners/${id}/suspend`, data);
    return response;
};


// Delete a SubCategory
export const deleteBanner = async (id: string | number) => {
    const response = await api.delete(`/banners/${id}`);
    return response;
};
//    upload link for banner image
export const getBannerUploadLink = async (fileType: string) => {
    const response = await api.post("/banners/upload-link?linkType=photo", { fileType });
    const data = response.data ?? response;
    if (!data?.url || !data?.fields) throw new Error("Upload link missing URL or fields");
    return data;
};