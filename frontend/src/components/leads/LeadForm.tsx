import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { leadsApi } from "../../api/leads";
import type {
  Lead,
  CreateLeadPayLoad,
  LeadStatus,
  LeadSource,
} from "../../types";
import Spinner from "../ui/Spinner";

interface LeadFormProps {
  lead?: Lead | null;
  onClose: () => void;
}

const defaultForm: CreateLeadPayLoad = {
  name: "",
  email: "",
  status: "New",
  source: "Website",
  notes: "",
};

export default function LeadForm({ lead, onClose }: LeadFormProps) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<CreateLeadPayLoad>(defaultForm);
  const [errors, setErros] = useState<
    Partial<Record<keyof CreateLeadPayLoad, string>>
  >({});

  const isEditing = !!lead;

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
        notes: lead.notes ?? "",
      });
    }
  }, [lead]);

  const mutation = useMutation({
    mutationFn: (data: CreateLeadPayLoad) =>
      isEditing
        ? leadsApi.updateLead(lead!._id, data)
        : leadsApi.createLead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success(isEditing ? "Lead updated" : "Lead created");
      onClose();
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateLeadPayLoad, string>> = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email";
    if (!form.source) newErrors.source = "Source is required";

    setErros(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate(form);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof CreateLeadPayLoad]) {
      setErros((prev) => ({ ...prev, [name]: "" }));
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="card w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {isEditing ? "Edit Lead" : "Add New Lead"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`input-field ${errors.name ? "border-red-400 focus:ring-red-400" : ""}`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={`input-field ${errors.email ? "border-red-400 focus:ring-red-400" : ""}`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="input-field"
              >
                {(
                  ["New", "Contacted", "Qualified", "Lost"] as LeadStatus[]
                ).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Source <span className="text-red-500">*</span>
              </label>
              <select
                name="source"
                value={form.source}
                onChange={handleChange}
                className={`input-field ${errors.source ? "border-red-400" : ""}`}
              >
                {(["Website", "Instagram", "Referral"] as LeadSource[]).map(
                  (s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ),
                )}
              </select>
              {errors.source && (
                <p className="text-xs text-red-500 mt-1">{errors.source}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Optional notes about this lead..."
              className="input-field resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-primary text-sm flex items-center gap-2"
            >
              {mutation.isPending && <Spinner size="sm" />}
              {isEditing ? "Save Changes" : "Create Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
