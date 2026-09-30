import { Link, useLocation, useNavigate } from "react-router-dom";
import { Wallet, LayoutDashboard, Receipt, LogOut } from "lucide-react";
import { motion } from "framer-motion";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Wallet size={21} />
          </div>

          <div>
            <h1 className="font-bold text-slate-900">ExpenseTrack</h1>
            <p className="text-xs text-slate-500">Manage your money</p>
          </div>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-2 md:flex">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${location.pathname === "/dashboard"
              ? "bg-indigo-50 text-indigo-600"
              : "text-slate-600 hover:bg-slate-100"
              }`}
          >
            <LayoutDashboard size={17} />
            Dashboard
          </Link>

          <Link
            to="/expenses"
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${location.pathname === "/expenses"
              ? "bg-indigo-50 text-indigo-600"
              : "text-slate-600 hover:bg-slate-100"
              }`}
          >
            <Receipt size={17} />
            Expenses
          </Link>
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-800">
              {JSON.parse(localStorage.getItem("user"))?.name || "User"}
            </p>
            <p className="text-xs text-slate-500">Student</p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
            {JSON.parse(localStorage.getItem("user"))?.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-500"
          >
            <LogOut size={18} />
          </motion.button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;