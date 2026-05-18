import { Search, X } from "lucide-react";
import type { LeadFilter, LeadSource, LeadStatus } from "../../types";

interface LeadFiltersBarProps {
  filters: LeadFilter;
  searchInput: string;
  onSearchChange: (val: string) => void;
  onFilterChange: (key: keyof LeadFilter, value: string | number) => void;
  onReset: () => void;
}

export default function LeadFiltersBar({
  filters,
  searchInput,
  onSearchChange,
  onFilterChange,
  onReset,
}: LeadFiltersBarProps) {
  const hasActiveFilters =
    filters.status !== "" ||
    filters.source !== "" ||
    filters.search !== "" ||
    filters.sort !== "latest";

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email..."
          className="input-field pl-9 text-sm"
        />
      </div>

      {/* status */}
      <select
        value={filters.status}
        onChange={(e) => onFilterChange("status", e.target.value)}
        className="input-field w-auto text-sm"
      >
        <option value="">All Statuses</option>
        {(["New", "Contacted", "Qualified", "Lost"] as LeadStatus[]).map(
          (s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ),
        )}
      </select>

      {/* source */}
      <select
        value={filters.source}
        onChange={(e) => onFilterChange("source", e.target.value)}
        className="input-field w-auto text-sm"
      >
        <option value="">All Sources</option>
        {(["Website", "Instagram", "Referral"] as LeadSource[]).map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* sort */}
      <select
        value={filters.sort}
        onChange={(e) => onFilterChange("sort", e.target.value)}
        className="input-field w-auto text-sm"
      >
        <option value="latest">Latest First</option>
        <option value="oldest">Oldest First</option>
      </select>

      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-2 py-2"
        >
          <X size={14} />
          Clear
        </button>
      )}
    </div>
  );
}
