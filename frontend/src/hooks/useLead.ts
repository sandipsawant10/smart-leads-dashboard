import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { leadsApi } from "../api/leads";
import type { LeadFilter } from "../types";
import { useDebounce } from "./useDebouce";

export function useLead(filters: LeadFilter) {
  const debouncedSearch = useDebounce(filters.search, 400);

  const query = useQuery({
    queryKey: ["leads", { ...filters, search: debouncedSearch }],

    queryFn: () =>
      leadsApi.getLeads({
        page: filters.page,
        search: debouncedSearch,
        status: filters.status || undefined,
        source: filters.source || undefined,
        sort: filters.sort,
      }),
  });
  return query;
}

export function useLeads(filters: LeadFilter) {
  return useLead(filters);
}

export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => leadsApi.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Lead deleted");
    },
    onError: () => {
      toast.error("Failed to delete lead");
    },
  });
}

export function useLeadById(id: string) {
  return useQuery({
    queryKey: ["lead", id],
    queryFn: () => leadsApi.getLeadById(id),
    enabled: !!id,
  });
}
