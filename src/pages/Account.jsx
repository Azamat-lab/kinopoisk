
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage")
  );

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("profileImage");
    navigate("/login");
  };

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem("profileImage", reader.result);
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center text-white relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-5 py-2 rounded-full transition"
      >
        ← Ortga
      </button>

      <div className="relative">
        {profileImage && (
          <img
            src={profileImage}
            alt="Profile"
            className="w-64 h-64 rounded-full border-4 border-yellow-400 shadow-xl object-cover"
          />
        )}

        <img
          src="https://cdn-icons-png.flaticon.com/512/8748/8748504.png"
          alt="Edit"
          onClick={openFilePicker}
          className="absolute bottom-4 right-4 w-14 h-14 cursor-pointer hover:scale-110 transition-all"
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      <h1 className="text-3xl font-bold mt-6 mb-4">Sizning profilingiz</h1>

      <button
        onClick={handleLogout}
        className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold"
      >
        Profildan chiqish
      </button>
    </div>
  );
}
