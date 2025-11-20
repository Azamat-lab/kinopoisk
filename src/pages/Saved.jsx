import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Saved() {
  const [savedMovies, setSavedMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const movies = JSON.parse(localStorage.getItem("savedMovies")) || [];
    setSavedMovies(movies);
  }, []);

  const deleteMovie = (id, e) => {
    e.stopPropagation(); 
    const updated = savedMovies.filter((movie) => movie.id !== id);
    setSavedMovies(updated);
    localStorage.setItem("savedMovies", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white p-4 sm:p-6">
      <div className="max-w-[1200px] mx-auto w-full">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6">
          🎬 Saqlangan kinolar
        </h2>

        {savedMovies.length === 0 ? (
          <p className="text-gray-400 text-center text-lg mt-20">
            Hech qanday kino saqlanmagan 😔
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {savedMovies.map((movie) => (
              <div
                key={movie.id}
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="cursor-pointer rounded-lg overflow-hidden bg-[#1a1a1a] shadow-md hover:bg-[#2a2a2a] hover:scale-[1.02] transition-all duration-300 relative"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-[300px] object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="text-lg font-bold text-yellow-400 truncate">
                    {movie.title}
                  </h3>
                  <p className="text-gray-300 text-sm mt-1 mb-3">
                    ⭐ {movie.vote_average} / 10
                  </p>
                  <button
                    onClick={(e) => deleteMovie(movie.id, e)}
                    className="bg-yellow-600 hover:bg-yellow-500 text-white py-1 px-4 rounded-md transition-all duration-200"
                  >
                    O‘chirish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
