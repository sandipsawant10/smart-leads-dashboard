import { NavLink } from "react-router-dom";
import { LayoutDashboard, User, X } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/leads", label: "leads", icon: User },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuthStore();

  return (
    <>
      {/* mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-60 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-gray-200 dark:border-gray-700">
          <span className="text-lg font-bold text-brand-600">SmartLeads</span>
          <button className="md:hidden text-gray-500" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* user info at bottom */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
            {user?.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {user?.role}
          </p>
        </div>
      </aside>
    </>
  );
}
