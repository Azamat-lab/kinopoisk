
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(
    "https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjkzNy1hZXctMTY1LWtsaGN3ZWNtLmpwZw.jpg"
  );

  const fileInputRef = useRef(null);

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.email === email && user.password === password) {
      localStorage.setItem("isLoggedIn", "true");

      localStorage.setItem("profileImage", profileImage);

      navigate("/");
    } else {
      alert("Email yoki parol xato!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D0D0D] text-white px-6">

      <div className="relative mb-6">
        <img
          src={profileImage}
          alt="Avatar"
          className="w-40 h-40 rounded-full object-cover border-4 border-yellow-400 shadow-lg"
        />

        <img
          src="https://cdn-icons-png.flaticon.com/512/8748/8748504.png"
          alt="Edit"
          className="absolute bottom-2 right-2 w-12 h-12 cursor-pointer hover:scale-110 transition"
          onClick={openFilePicker}
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#1a1a1a] p-8 rounded-2xl shadow-md w-full max-w-sm border border-yellow-400/30"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center text-yellow-400">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 bg-[#0D0D0D] text-white border border-yellow-400/40 rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Parol"
          className="w-full p-3 mb-6 bg-[#0D0D0D] text-white border border-yellow-400/40 rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full py-3 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-400 transition"
        >
          Kirish
        </button>

        <p className="text-center mt-4 text-gray-400">
          Akkauntingiz yo‘qmi?{" "}
          <span
            className="text-yellow-400 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Ro‘yxatdan o‘tish
          </span>
        </p>
      </form>
    </div>
  );
}
