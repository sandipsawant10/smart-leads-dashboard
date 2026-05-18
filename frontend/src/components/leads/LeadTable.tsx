import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import type { Lead } from "../../types";
import { StatusBadge, SourceBadge } from "../ui/Badge";
import { useAuthStore } from "../../stores/authStore";

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export default function LeadTable({ leads, onEdit, onDelete }: LeadTableProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Email
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Source
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Created
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {leads.map((lead) => (
            <tr
              key={lead._id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group"
            >
              <td className="py-3 px-4">
                <button
                  onClick={() => navigate(`/leads/${lead._id}`)}
                  className="font-medium text-gray-900 dark:text-gray-100 hover:text-brand-600 dark:hover:text-brand-400 text-left"
                >
                  {lead.name}
                </button>
              </td>
              <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                {lead.email}
              </td>
              <td className="py-3 px-4">
                <StatusBadge status={lead.status} />
              </td>
              <td className="py-3 px-4">
                <SourceBadge source={lead.source} />
              </td>
              <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                {new Date(lead.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(lead)}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => onDelete(lead)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
