import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      alert("Iltimos, barcha maydonlarni to‘ldiring!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Parollar mos emas!");
      return;
    }

    const user = { email, password };
    localStorage.setItem("user", JSON.stringify(user));
    alert("Ro‘yxatdan o‘tish muvaffaqiyatli!");

    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D0D0D] text-white px-6">
      <form
        onSubmit={handleRegister}
        className="bg-[#1a1a1a] p-8 rounded-2xl shadow-md w-full max-w-sm border border-yellow-400/30"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center text-yellow-400">
          Ro‘yxatdan o‘tish
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 bg-[#0D0D0D] text-white border border-yellow-400/40 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Parol"
          className="w-full p-3 mb-4 bg-[#0D0D0D] text-white border border-yellow-400/40 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Parolni tasdiqlang"
          className="w-full p-3 mb-6 bg-[#0D0D0D] text-white border border-yellow-400/40 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full py-3 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-400 transition"
        >
          Ro‘yxatdan o‘tish
        </button>

        <p className="text-center mt-4 text-gray-400">
          Akkaunt bormi?{" "}
          <span
            className="text-yellow-400 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Kirish
          </span>
        </p>
      </form>
    </div>
  );
}
