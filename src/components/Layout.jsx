import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  MessageSquare,
  Globe,
  LogOut,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Heart,
  TrendingUp,
  BookOpen,
  DollarSign,
  User,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getNavItems = () => {
    if (!user) return [];

    if (user.role === "farmer") {
      return [
        { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
        { icon: Package, label: "Listings", to: "/listings" },
        { icon: Heart, label: "Donations", to: "/donations" },
        { icon: TrendingUp, label: "AI Insights", to: "/insights" },
        { icon: DollarSign, label: "Earnings", to: "/earnings" },
        { icon: ShoppingCart, label: "Orders", to: "/orders" },
        { icon: Package, label: "Deliveries", to: "/deliveries" },
        { icon: BookOpen, label: "Learning", to: "/learning" },
        { icon: MessageSquare, label: "Messages", to: "/messages" },
        { icon: User, label: "Profile", to: "/profile" },
        { icon: MessageSquare, label: "Offers", to: "/offers" },
      ];
    }

    if (user.role === "buyer") {
      return [
        { icon: LayoutDashboard, label: "Dashboard", to: "/buyer/dashboard" },
        { icon: ShoppingCart, label: "Marketplace", to: "/marketplace" },
        { icon: Package, label: "Orders", to: "/buyer/orders" },
        { icon: MessageSquare, label: "Messages", to: "/messages" },
        { icon: User, label: "Profile", to: "/buyer/profile" },
      ];
    }
if (user.role === "driver") {
  return [
    { icon: Package, label: "Delivery", to: "/driver/delivery" },
    { icon: DollarSign, label: "Earnings", to: "/driver/earnings" },
    { icon: User, label: "Profile", to: "/driver/profile" },
  ];
}



    if (user.role === "ngo") {
      return [
        { icon: LayoutDashboard, label: "Dashboard", to: "/ngo/dashboard" },
        { icon: Heart, label: "Donations", to: "/donations" },
        { icon: MessageSquare, label: "Messages", to: "/messages" },
      ];
    }

    return [];
  };

  const navItems = getNavItems();

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिन्दी" },
    { code: "fr", name: "Français" },
    { code: "es", name: "Español" },
  ];

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* Top Navbar */}
      <nav
        className="navbar navbar-light bg-white border-bottom shadow-sm fixed-top d-flex justify-content-between align-items-center px-3"
        style={{ height: "64px", zIndex: 1050 }}
      >
        <div className="d-flex align-items-center">
          <button
            className="btn btn-link d-lg-none text-dark me-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="d-flex align-items-center">
            <div
              className="bg-success text-white fw-bold rounded d-flex align-items-center justify-content-center"
              style={{ width: "40px", height: "40px" }}
            >
              A
            </div>
            <span className="fw-bold fs-5 text-success ms-2">AgriConnect</span>
          </div>
        </div>

        {/* Right section */}
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-link text-dark position-relative">
            <Bell size={22} />
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger rounded-circle"></span>
          </button>

          <button className="btn btn-link text-dark position-relative">
            <MessageSquare size={22} />
            <span className="position-absolute top-0 start-100 translate-middle p-1 bg-success rounded-circle"></span>
          </button>

          {/* Language Dropdown */}
          <div className="dropdown">
            <button
              className="btn btn-link dropdown-toggle text-dark"
              type="button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
            >
              <Globe size={20} className="me-1" />
              {language.toUpperCase()}
            </button>
            {langMenuOpen && (
              <ul className="dropdown-menu show">
                {languages.map((lang) => (
                  <li key={lang.code}>
                    <button
                      className={`dropdown-item ${
                        language === lang.code ? "active" : ""
                      }`}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangMenuOpen(false);
                      }}
                    >
                      {lang.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-outline-danger btn-sm fw-semibold"
          >
            <LogOut size={18} className="me-1" />
            Logout
          </button>
        </div>
      </nav>

      {/* Sidebar */}
      {user && (
        <div
          className={`bg-white border-end shadow-sm position-fixed top-0 start-0 pt-5 ${
            sidebarOpen ? "translate-none" : "d-none d-lg-block"
          }`}
          style={{
            width: "240px",
            height: "100vh",
            paddingTop: "70px",
            zIndex: 1040,
          }}
        >
          <nav className="nav flex-column p-3">
            {navItems.map((item, i) => (
              <Link
                key={i}
                to={item.to}
                className="nav-link d-flex align-items-center text-dark py-2 rounded hover-bg-light"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={20} className="me-2 text-success" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div
        className="flex-grow-1"
        style={{
          marginTop: "64px",
          marginLeft: user ? "240px" : "0px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
