import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import ApperIcon from "@/components/ApperIcon";
import UserAvatar from "@/components/molecules/UserAvatar";
import { AuthContext } from "../../App";
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Issues", icon: "Bug" },
    { path: "/projects", label: "Projects", icon: "FolderOpen" },
    { path: "/reports", label: "Reports", icon: "BarChart3" },
  ];

const { user, isAuthenticated } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">TrackFlow</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-primary-50 text-primary-700 border-b-2 border-primary-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <ApperIcon name={item.icon} className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Avatar & Logout */}
          <div className="flex items-center gap-3">
            <UserAvatar user={user} size="md" />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.firstName || user?.name || 'User'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="LogOut" className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <nav className="flex">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-primary-50 text-primary-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <ApperIcon name={item.icon} className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;