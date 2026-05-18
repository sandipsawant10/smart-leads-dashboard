import { Users } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "No leads found",
  description = "Try adjusting your filters or add a new lead.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <Users size={24} className="text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
        {description}
      </p>
    </div>
  );
}
