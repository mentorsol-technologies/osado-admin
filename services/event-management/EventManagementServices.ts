import api from "@/lib/axios";


export const GetAllEventsLIst = async () => {
    const response = await api.get("/events");
    return response;
};

export const ViewEventsDetails = async (id: string) => {
    const response = await api.get(`/events/details/${id}`);
    return response;
}


export const UploadEventLink = async (fileType: string) => {
    const response = await api.post("/events/upload-link?linkType=photo", { fileType });
    const data = response.data ?? response;
    if (!data?.url || !data?.fields) throw new Error("Upload link missing URL or fields");
    return data;
};

export const getCategories = async () => {
    const response = await api.get("/categories");
    return response.data;
};


export const createEvents = async (data: any) => {
    const response = await api.post("/events", data);
    return response;
};

export const updateEvent = async (id: string | number, data: any,) => {
    const response = await api.patch(`/events/edit/${id}`, data);
    return response;
};

export const suspendedEvent = async (data: any,) => {
    const response = await api.patch("/events/suspend", data);
    return response;
};

export const deleteEvent = async (id: string | number) => {
    const response = await api.delete(`/events/${id}`);
    return response;
};

export const BussinessOwnerInfo = async (id: string) => {
    const response = await api.get(`users/business-owner/${id}`)
    return response;
}

export const ownerSuspended = async (id:string,data:any) =>{
    const response = await api.patch(`business-owner/${id}/suspend`,data);
    return response;
}