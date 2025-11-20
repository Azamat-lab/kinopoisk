import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();

  const API_KEY = "c331e966af5c9e27ef3b804f938f6db3";

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=ru-RU`)
      .then((res) => res.json())
      .then((data) => setMovie(data));

    fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=ru-RU`)
      .then((res) => res.json())
      .then((data) => setCredits(data.cast.slice(0, 8)));

    fetch(`https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${API_KEY}&language=ru-RU`)
      .then((res) => res.json())
      .then((data) => setRecommendations(data.results.slice(0, 8)));
  }, [id]);

  if (!movie) return <div className="text-white text-center mt-10">Yuklanmoqda...</div>;

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-yellow-500 text-black px-4 py-2 rounded-md hover:bg-yellow-400 transition"
      >
        ← Ortga
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full md:w-[350px] rounded-lg shadow-lg"
        />

        <div>
          <h1 className="text-4xl font-bold text-yellow-400 mb-3">{movie.title}</h1>
          <p className="text-gray-300 mb-2">⭐ {movie.vote_average?.toFixed(1)} / 10</p>
          <p className="text-gray-400 mb-4">{movie.overview}</p>
          <p className="text-sm text-gray-500">🗓️ {movie.release_date}</p>
          <p className="text-sm text-gray-500">⏱️ {movie.runtime} daqiqa</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Aktyorlar</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {credits.map((actor) => (
            <div
              key={actor.id}
              className="bg-[#1a1a1a] rounded-lg overflow-hidden text-center hover:bg-[#2a2a2a] transition"
            >
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                    : "https://via.placeholder.com/150"
                }
                alt={actor.name}
                className="w-full h-[180px] object-cover"
              />
              <p className="text-sm font-semibold text-yellow-400 mt-2">{actor.name}</p>
              <p className="text-xs text-gray-400 mb-2">{actor.character}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Tavsiya etilgan kinolar</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              onClick={() => navigate(`/movie/${rec.id}`)}
              className="cursor-pointer bg-[#1a1a1a] rounded-lg overflow-hidden hover:scale-105 transition-transform"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${rec.poster_path}`}
                alt={rec.title}
                className="w-full h-[250px] object-cover"
              />
              <div className="p-3 text-center">
                <p className="text-yellow-400 font-semibold truncate">{rec.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
