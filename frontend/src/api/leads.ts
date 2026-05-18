import api from "./axios";
import type {
  ApiResponse,
  Lead,
  LeadFilter,
  CreateLeadPayLoad,
  UpdateLeadPayload,
} from "../types";

export const leadsApi = {
  getLeads: async (
    filters: Partial<LeadFilter>,
  ): Promise<ApiResponse<{ leads: Lead[] }>> => {
    const params: Record<string, string> = {};

    if (filters.page) params.page = String(filters.page);
    if (filters.search) params.search = String(filters.search);
    if (filters.status) params.status = String(filters.status);
    if (filters.source) params.source = String(filters.source);
    if (filters.sort) params.sort = String(filters.sort);

    const { data } = await api.get<
      ApiResponse<{
        leads: Lead[];
      }>
    >("/leads", { params });
    return data;
  },

  getLeadById: async (id: string): Promise<ApiResponse<{ lead: Lead }>> => {
    const { data } = await api.get<ApiResponse<{ lead: Lead }>>(`/leads/${id}`);
    return data;
  },

  createLead: async (
    payload: CreateLeadPayLoad,
  ): Promise<ApiResponse<{ lead: Lead }>> => {
    const { data } = await api.post<
      ApiResponse<{
        lead: Lead;
      }>
    >("/leads", payload);
    return data;
  },

  updateLead: async (
    id: string,
    payload: UpdateLeadPayload,
  ): Promise<ApiResponse<{ lead: Lead }>> => {
    const { data } = await api.put<ApiResponse<{ lead: Lead }>>(
      `/leads/${id}`,
      payload,
    );
    return data;
  },

  deleteLead: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await api.delete<ApiResponse<null>>(`/leads/${id}`);
    return data;
  },

  exportCSV: async (): Promise<Blob> => {
    const response = await api.get("/leads/export", {
      responseType: "blob",
    });
    return response.data as Blob;
  },
};
