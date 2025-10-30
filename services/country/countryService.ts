

import api from "@/lib/axios";

export const getCountries = async () => {
    const response = await api.get("/country");
    return response.data;
};

export const createCountry = async (data: any) => {
    const response = await api.post("/country", data);
    return response;
};
// ✅ Update Country
export const updateCountry = async (countryId: string | number, data: any) => {
    const response = await api.patch(`/country/${countryId}`, data);
    return response;
};

// ✅ Delete a category
export const deleteCountry = async (id: number) => {
    const response = await api.delete(`/country/${id}`);
    return response;
};

export const getCountryUploadLink = async (fileType: string) => {
  const response = await api.post("/country/upload-link?linkType=icon", { fileType });
  const data = response.data ?? response;
  if (!data?.url || !data?.fields) throw new Error("Upload link missing URL or fields");
  return data; 
};

