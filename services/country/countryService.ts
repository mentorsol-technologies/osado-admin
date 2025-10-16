

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

export const uploadCountryFile = async (file: File) => {
    try {
        console.log("Starting uploadCountryFile for:", file.name);

        let response;
        try {
            response = await api.post("/country/upload-link?linkType=icon", {
                fileType: file.type,
            });
            console.log("Upload link API response received:", response);
        } catch (err) {
            console.error("Upload link API call failed:", err);
            throw err; // stop here if first call fails
        }

        // Ensure we have the expected data structure
        const data = response.data ?? response;
        if (!data?.url || !data?.fields) {
            console.error("Invalid upload-link response:", data);
            throw new Error("Upload link response missing `url` or `fields`");
        }

        const { url, fields, uploadId } = data;

        const formData = new FormData();
        Object.entries(fields).forEach(([key, value]) => {
            formData.append(key, value as string);
        });
        formData.append("Content-Type", file.type);
        formData.append("file", file);


        const s3Response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        if (!s3Response.ok) {
            const text = await s3Response.text();
            console.error("S3 upload failed:", s3Response.status, text);
            throw new Error(`S3 upload failed: ${s3Response.statusText}`);
        }

        const fileUrl = `${url}${fields.key}`;
        console.log("File uploaded successfully:", fileUrl);

        return { fileUrl, uploadId };
    } catch (error) {
        console.error("File upload failed (outer):", error);
        throw error;
    }
};