import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useLeadById, useDeleteLead } from "../hooks/useLeads";
import { useAuthStore } from "../stores/authStore";
import { StatusBadge, SourceBadge } from "../components/ui/Badge";
import LeadForm from "../components/leads/LeadForm";
import ConfirmModal from "../components/ui/ConfirmModal";
import Spinner from "../components/ui/Spinner";

export default function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { data, isLoading, isError } = useLeadById(id!);
  const deleteMutation = useDeleteLead();

  const lead = data?.data?.lead;
  const isAdmin = user?.role === "admin";

  const handleDelete = async () => {
    if (!lead) return;
    await deleteMutation.mutateAsync(lead._id);
    navigate("/leads");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !lead) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 dark:text-red-400">Lead not found.</p>
        <button
          onClick={() => navigate("/leads")}
          className="text-brand-600 text-sm mt-3 hover:underline"
        >
          Back to Leads
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <button
        onClick={() => navigate("/leads")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <ArrowLeft size={16} />
        Back to Leads
      </button>

      <div className="card p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {lead.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              {lead.email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEdit(true)}
              className="btn-secondary text-sm flex items-center gap-2"
            >
              <Pencil size={14} />
              Edit
            </button>
            {isAdmin && (
              <button
                onClick={() => setShowDelete(true)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <Trash2 size={14} />
                Delete
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Status
            </p>
            <StatusBadge status={lead.status} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Source
            </p>
            <SourceBadge source={lead.source} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Created By
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {lead.createdBy}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Created At
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {lead.notes && (
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Notes
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {lead.notes}
            </p>
          </div>
        )}
      </div>

      {showEdit && <LeadForm lead={lead} onClose={() => setShowEdit(false)} />}

      <ConfirmModal
        isOpen={showDelete}
        title="Delete Lead"
        message={`Delete "${lead.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
