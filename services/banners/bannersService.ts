import api from "@/lib/axios";



export const createBanner = async (data: any) => {
    const response = await api.post("/banners", data);
    return response;
};

// Get All SubCategories
export const getBanner = async (page = 1, limit = 6, searchQuery?: string) => {
    return await api.get("/banners", {
        params: { page, limit, ...(searchQuery ? { searchQuery } : {}) },
    });
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

// The response interceptor in lib/axios.ts already unwraps response.data for
// every call through `api` - these return the interceptor's result directly,
// matching getBanner/createBanner above. Adding another .data here would grab
// a nonexistent nested field and silently return undefined.
export const getBannerById = async (id: string) => {
    return await api.get(`/banners/${id}`);
};

// Business-owner banner requests awaiting admin review (defaults to pending).
export const getBannerRequests = async (page = 1, limit = 10, status?: string) => {
    return await api.get("/banners/requests", {
        params: { page, limit, ...(status ? { status } : {}) },
    });
};

export const approveBanner = async (id: string, price?: number) => {
    return await api.patch(`/banners/${id}/approve`, price != null ? { price } : {});
};

export const rejectBanner = async (id: string, reason: string) => {
    return await api.patch(`/banners/${id}/reject`, { reason });
};