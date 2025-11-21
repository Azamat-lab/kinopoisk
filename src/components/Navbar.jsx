
import React, { useState, useEffect } from "react";
import { Search, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";

export default function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const logged = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(logged);

    const storedImage = localStorage.getItem("profileImage");
    if (storedImage) setProfileImage(storedImage);
  }, [location]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    navigate(`/?query=${encodeURIComponent(value)}`);
  };

  const handleLogoClick = () => {
    navigate("/");
    setMobileMenu(false);
  };

  const checkLoginStatus = () => {
    return localStorage.getItem("isLoggedIn") === "true";
  };

  const handleCartoonsClick = (e) => {
    e.preventDefault();
    if (!checkLoginStatus()) {
      setShowLoginModal(true);
      setMobileMenu(false);
    } else {
      navigate("/cartoons");
      setMobileMenu(false);
    }
  };

  const handleSavedClick = (e) => {
    e.preventDefault();
    if (!checkLoginStatus()) {
      setShowLoginModal(true);
      setMobileMenu(false);
    } else {
      navigate("/saved");
      setMobileMenu(false);
    }
  };

  const handleLogin = () => {
    setShowLoginModal(false);
    navigate("/login");
  };

  const handleCancel = () => {
    setShowLoginModal(false);
  };

  const links = [
    { name: "Movie🎥", path: "/" },
    { name: "Cartoons🎥", path: "/cartoons", onClick: handleCartoonsClick },
    { name: "Saved🎥", path: "/saved", onClick: handleSavedClick },
  ];

  // Login/profilni faqat '/' sahifada ko'rsatamiz
  const showAuthLinks = location.pathname === "/";

  return (
    <nav className="bg-[#0D0D0D] text-white shadow-md border-b border-yellow-500/20 w-full">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-12 flex items-center justify-between py-4 relative">
        <div
          onClick={handleLogoClick}
          className="flex items-center gap-3 text-2xl font-semibold tracking-wide cursor-pointer"
        >
          <img
            src={logo}
            alt="Logo"
            className="w-36 h-auto object-contain hover:scale-105 transition-all duration-400 "
          />
        </div>

        <div className="hidden md:flex items-center gap-10 text-[17px] font-medium">
          {links.map((link) => (
            link.path === "/" ? (
              <Link
                key={link.path}
                to={link.path}
                className={`hover:text-yellow-400 transition duration-200 ${
                  location.pathname === link.path ? "text-yellow-400" : ""
                }`}
              >
                {link.name}
              </Link>
            ) : (
              <button
                key={link.path}
                onClick={link.onClick}
                className={`hover:text-yellow-400 transition duration-200 ${
                  location.pathname === link.path ? "text-yellow-400" : ""
                }`}
              >
                {link.name}
              </button>
            )
          ))}
        </div>

        <div className="flex items-center gap-4">
          {!showSearch && (
            <button
              onClick={() => setShowSearch(true)}
              className="hover:text-yellow-400 transition-all"
            >
              <Search size={24} />
            </button>
          )}

          {showSearch && (
            <div className="flex items-center bg-[#1a1a1a] border border-yellow-400/40 rounded-full pl-4 pr-2 py-1 transition-all duration-300">
              <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder="Search movies..."
                className="bg-transparent outline-none text-white placeholder-gray-400 w-40 sm:w-56"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  setShowSearch(false);
                  setQuery("");
                  navigate("/");
                }}
                className="ml-2 text-gray-400 hover:text-red-500 text-lg font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {showAuthLinks && (
            isLoggedIn && profileImage ? (
              <Link to="/account">
                <img
                  src={profileImage}
                  alt="User"
                  className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400 hover:scale-105 transition"
                />
              </Link>
            ) : (
              <Link
                to="/login"
                className="ml-4 hover:text-yellow-400 transition duration-200"
              >
                Login
              </Link>
            )
          )}

          <button
            className="md:hidden ml-2 hover:text-yellow-400 transition-all"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {mobileMenu && (
        <div className="md:hidden bg-[#0D0D0D] border-t border-yellow-500/20">
          <div className="flex flex-col items-start px-6 py-4 gap-4">
            {links.map((link) => (
              link.path === "/" ? (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenu(false)}
                  className={`hover:text-yellow-400 transition duration-200 ${
                    location.pathname === link.path ? "text-yellow-400" : ""
                  }`}
                >
                  {link.name}
                </Link>
              ) : (
                <button
                  key={link.path}
                  onClick={link.onClick}
                  className={`hover:text-yellow-400 transition duration-200 ${
                    location.pathname === link.path ? "text-yellow-400" : ""
                  }`}
                >
                  {link.name}
                </button>
              )
            ))}
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
          <div className="bg-[#1a1a1a] p-8 rounded-lg w-11/12 md:w-1/3 text-center">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">Login Required</h3>
            <p className="text-gray-300 mb-6">
              Kino tafsilotlarini ko'rish yoki saqlash uchun tizimga kiring
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogin}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-6 py-2 rounded-lg transition"
              >
                Login
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 hover:bg-gray-500 text-white font-semibold px-6 py-2 rounded-lg transition"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}