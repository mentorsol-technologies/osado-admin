export const uploadToS3 = async (file: File, url: string, fields: Record<string, any>) => {
    const formData = new FormData();

    Object.entries(fields).forEach(([key, value]) => formData.append(key, value as string));
    formData.append("Content-Type", file.type);
    formData.append("file", file);

    try {
        await fetch(url, { method: "POST", body: formData, mode: "no-cors" });

      

        console.log("S3 upload successful!");
    } catch (err) {
        console.error("uploadToS3 error:", err);
    }
};
