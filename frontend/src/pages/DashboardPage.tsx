import { useQuery } from "@tanstack/react-query";
import { Users, TrendingUp, UserCheck, UserX } from "lucide-react";
import { Link } from "react-router-dom";
import { leadsApi } from "../api/leads";
import { useAuthStore } from "../stores/authStore";
import Spinner from "../components/ui/Spinner";
import type { LeadStatus } from "../types";

const statusConfig: Record<
  LeadStatus,
  { label: string; icon: React.ElementType; color: string }
> = {
  New: {
    label: "New Leads",
    icon: Users,
    color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
  },
  Contacted: {
    label: "Contacted",
    icon: TrendingUp,
    color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30",
  },
  Qualified: {
    label: "Qualified",
    icon: UserCheck,
    color: "text-green-600 bg-green-100 dark:bg-green-900/30",
  },
  Lost: {
    label: "Lost",
    icon: UserX,
    color: "text-red-600 bg-red-100 dark:bg-red-900/30",
  },
};

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: allLeads, isLoading } = useQuery({
    queryKey: ["leads-stats"],
    queryFn: () => leadsApi.getLeads({ sort: "latest" }),
  });

  const leads = allLeads?.data?.leads ?? [];
  const total = allLeads?.pagination?.total ?? 0;

  const countByStatus = (status: LeadStatus) =>
    leads.filter((l) => l.status === status).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Here's a quick overview of your leads.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* total leads card */}
          <Link
            to="/leads"
            className="card p-6 flex items-center gap-5 hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
              <Users size={22} className="text-brand-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Leads
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {total}
              </p>
            </div>
          </Link>

          {/* status breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(Object.keys(statusConfig) as LeadStatus[]).map((status) => {
              const cfg = statusConfig[status];
              const Icon = cfg.icon;
              const count = countByStatus(status);
              const pct =
                total > 0 ? Math.round((count / leads.length) * 100) : 0;

              return (
                <Link
                  key={status}
                  to={`/leads?status=${encodeURIComponent(status)}`}
                  className="card p-5 hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${cfg.color}`}
                  >
                    <Icon size={18} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {count}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {cfg.label}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {pct}% of current page
                  </p>
                </Link>
              );
            })}
          </div>

          {/* recent leads table */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                Recent Leads
              </h2>
            </div>
            {leads.length === 0 ? (
              <p className="text-center py-10 text-sm text-gray-500 dark:text-gray-400">
                No leads yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      {["Name", "Email", "Status", "Source", "Date"].map(
                        (h) => (
                          <th
                            key={h}
                            className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {leads.slice(0, 5).map((lead) => (
                      <tr
                        key={lead._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                          {lead.name}
                        </td>
                        <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                          {lead.email}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                          {lead.source}
                        </td>
                        <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
