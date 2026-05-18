import { useState } from "react";
import { Plus, Download } from "lucide-react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import type { Lead, LeadFilter } from "../types";
import { useLeads, useDeleteLead } from "../hooks/useLeads";
import { leadsApi } from "../api/leads";
import LeadTable from "../components/leads/LeadTable";
import LeadFiltersBar from "../components/leads/LeadFiltersBar";
import LeadForm from "../components/leads/LeadForm";
import ConfirmModal from "../components/ui/ConfirmModal";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import Spinner from "../components/ui/Spinner";

const defaultFilters: LeadFilter = {
  page: 1,
  search: "",
  status: "",
  source: "",
  sort: "latest",
};

const getFiltersFromSearchParams = (
  searchParams: URLSearchParams,
): LeadFilter => ({
  page: Number(searchParams.get("page") ?? 1) || 1,
  search: searchParams.get("search") ?? "",
  status: (searchParams.get("status") ?? "") as LeadFilter["status"],
  source: (searchParams.get("source") ?? "") as LeadFilter["source"],
  sort: (searchParams.get("sort") ?? "latest") as LeadFilter["sort"],
});

export default function LeadsPage() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<LeadFilter>(() =>
    getFiltersFromSearchParams(searchParams),
  );
  const [searchInput, setSearchInput] = useState(filters.search);
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading, isError } = useLeads(filters);
  const deleteMutation = useDeleteLead();

  const leads = data?.data?.leads ?? [];
  const pagination = data?.pagination;

  const handleSearchChange = (val: string) => {
    setSearchInput(val);
    setFilters((prev) => ({ ...prev, search: val, page: 1 }));
  };

  const handleFilterChange = (
    key: keyof LeadFilter,
    value: string | number,
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setSearchInput("");
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingLead(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingLead) return;
    await deleteMutation.mutateAsync(deletingLead._id);
    setDeletingLead(null);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await leadsApi.exportCSV();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV exported");
    } catch {
      toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Leads
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {pagination
              ? `${pagination.total} total leads`
              : "Manage your leads"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="btn-secondary text-sm flex items-center gap-2"
          >
            {isExporting ? <Spinner size="sm" /> : <Download size={15} />}
            Export CSV
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary text-sm flex items-center gap-2"
          >
            <Plus size={15} />
            Add Lead
          </button>
        </div>
      </div>

      {/* filters */}
      <div className="card p-4">
        <LeadFiltersBar
          filters={filters}
          searchInput={searchInput}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />
      </div>

      {/* table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : isError ? (
          <div className="py-16 text-center">
            <p className="text-red-500 dark:text-red-400 text-sm">
              Failed to load leads. Please try again.
            </p>
          </div>
        ) : leads.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <LeadTable
              leads={leads}
              onEdit={handleEdit}
              onDelete={setDeletingLead}
            />
            {pagination && pagination.totalPages > 1 && (
              <div className="px-4 border-t border-gray-200 dark:border-gray-700">
                <Pagination
                  meta={pagination}
                  onPageChange={(p) =>
                    setFilters((prev) => ({ ...prev, page: p }))
                  }
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* modals */}
      {showForm && <LeadForm lead={editingLead} onClose={handleCloseForm} />}

      <ConfirmModal
        isOpen={!!deletingLead}
        title="Delete Lead"
        message={`Are you sure you want to delete "${deletingLead?.name}"? This can't be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingLead(null)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
