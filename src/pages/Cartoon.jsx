import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function Cartoon() {
  const [cartoons, setCartoons] = useState([]);
  const [selectedCartoon, setSelectedCartoon] = useState(null);
  const [credits, setCredits] = useState([]);
  const [videos, setVideos] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [similarCartoons, setSimilarCartoons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query");
  const API_KEY = "c331e966af5c9e27ef3b804f938f6db3";

  useEffect(() => {
    const fetchCartoons = async () => {
      try {
        setLoading(true);
        const res = query
          ? await axios.get(
              `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
                query
              )}&page=${page}&with_genres=16`
            )
          : await axios.get(
              `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=16&page=${page}`
            );

        setCartoons(res.data.results);
        setTotalPages(res.data.total_pages > 500 ? 500 : res.data.total_pages);
      } catch {
        setError("Xatolik yuz berdi!");
      } finally {
        setLoading(false);
      }
    };
    fetchCartoons();
  }, [query, page]);

  const openModal = async (cartoon) => {
    setSelectedCartoon(cartoon);
    setCredits([]);
    setVideos([]);
    setRecommendations([]);
    setSimilarCartoons([]);

    try {
      const [creditsRes, videoRes, recRes, similarRes] = await Promise.all([
        axios.get(
          `https://api.themoviedb.org/3/movie/${cartoon.id}/credits?api_key=${API_KEY}`
        ),
        axios.get(
          `https://api.themoviedb.org/3/movie/${cartoon.id}/videos?api_key=${API_KEY}`
        ),
        axios.get(
          `https://api.themoviedb.org/3/movie/${cartoon.id}/recommendations?api_key=${API_KEY}`
        ),
        axios.get(
          `https://api.themoviedb.org/3/movie/${cartoon.id}/similar?api_key=${API_KEY}`
        ),
      ]);

      setCredits(creditsRes.data.cast.slice(0, 10));
      setVideos(videoRes.data.results.slice(0, 1));
      setRecommendations(recRes.data.results.slice(0, 6));
      setSimilarCartoons(similarRes.data.results.slice(0, 6));
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = () => {
    setSelectedCartoon(null);
    setCredits([]);
    setVideos([]);
    setRecommendations([]);
    setSimilarCartoons([]);
  };

  const saveCartoon = (cartoon) => {
    const saved = JSON.parse(localStorage.getItem("savedMovies")) || [];
    if (!saved.some((m) => m.id === cartoon.id)) {
      saved.push(cartoon);
      localStorage.setItem("savedMovies", JSON.stringify(saved));
      alert("🎬 Multfilm saqlandi!");
    } else alert("✅ Bu multfilm allaqachon saqlangan!");
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white p-4 sm:p-6">
      <div className="max-w-[1200px] mx-auto w-full">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6 ">
          {query ? "Qidiruv natijalari:" : "Multfilmlar:"}
        </h2>

        {loading ? (
          <p className="text-center text-yellow-400">Yuklanmoqda...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {cartoons.map((cartoon) => (
              <div
                key={cartoon.id}
                onClick={() => openModal(cartoon)}
                className="cursor-pointer bg-[#1a1a1a] rounded-lg overflow-hidden hover:bg-[#2a2a2a] transition relative"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${cartoon.poster_path}`}
                  alt={cartoon.title}
                  className="w-full h-[300px] object-cover"
                />
                <div className="p-3 text-center">
                  <h3 className="text-yellow-400 font-semibold truncate">
                    {cartoon.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    ⭐ {cartoon.vote_average?.toFixed(1)}
                  </p>
                </div>
                <img
                  onClick={(e) => {
                    e.stopPropagation();
                    saveCartoon(cartoon);
                  }}
                  src="https://cdn-icons-png.flaticon.com/512/2791/2791383.png"
                  alt="save"
                  className="absolute top-3 left-3 w-7 h-7 hover:scale-110 transition"
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center items-center gap-6 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={`px-4 py-2 rounded-md ${
              page === 1
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-400"
            } text-black font-semibold transition`}
          >
            ← Previous
          </button>
          <span className="text-yellow-400 font-medium">
            {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={`px-4 py-2 rounded-md ${
              page === totalPages
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-400"
            } text-black font-semibold transition`}
          >
            Next → 
          </button>
        </div>

        {selectedCartoon && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
            <div className="bg-[#1a1a1a] p-8 rounded-lg w-11/12 md:w-3/4 lg:w-1/2 relative overflow-y-auto max-h-[90vh]">
              <img
                onClick={() => saveCartoon(selectedCartoon)}
                src="https://cdn-icons-png.flaticon.com/512/2791/2791383.png"
                alt="save"
                className="absolute top-5 left-5 w-8 h-8 cursor-pointer hover:scale-110 transition"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white text-3xl font-bold"
              >
                &times;
              </button>

              <h3 className="text-3xl font-bold text-yellow-400 mb-4 text-center">
                {selectedCartoon.title}
              </h3>

              <div className="text-center mb-6">
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(
                    selectedCartoon.title +
                      " full movie cartoon to‘liq versiya"
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg transition"
                >
                  🎥 Google’da to‘liq videoni qidirish
                </a>
              </div>

              {videos.length > 0 && (
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${videos[0].key}`}
                  title="Trailer"
                  className="rounded-lg mb-4"
                  allowFullScreen
                ></iframe>
              )}

              {credits.length > 0 && (
                <div>
                  <h4 className="text-2xl text-yellow-400 mb-4">Aktyorlar</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-8">
                    {credits.map((a) => (
                      <div key={a.id} className="text-center">
                        <img
                          src={
                            a.profile_path
                              ? `https://image.tmdb.org/t/p/w300${a.profile_path}`
                              : "https://via.placeholder.com/150"
                          }
                          className="w-24 h-32 mx-auto rounded-md object-cover"
                        />
                        <p className="text-sm text-yellow-400 mt-2">{a.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recommendations.length > 0 && (
                <div>
                  <h4 className="text-2xl text-yellow-400 mb-4">
                    Sizga yoqishi mumkin 🎬
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                    {recommendations.map((rec) => (
                      <div
                        key={rec.id}
                        onClick={() => openModal(rec)}
                        className="cursor-pointer bg-[#2a2a2a] rounded-lg overflow-hidden hover:bg-[#3a3a3a] transition"
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w500${rec.poster_path}`}
                          alt={rec.title}
                          className="w-full h-[200px] object-cover"
                        />
                        <p className="text-center text-yellow-400 text-sm p-2 truncate">
                          {rec.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {similarCartoons.length > 0 && (
                <div>
                  <h4 className="text-2xl text-yellow-400 mb-4">
                    O‘xshash multfilmlar 🎞️
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {similarCartoons.map((sim) => (
                      <div
                        key={sim.id}
                        onClick={() => openModal(sim)}
                        className="cursor-pointer bg-[#2a2a2a] rounded-lg overflow-hidden hover:bg-[#3a3a3a] transition"
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w500${sim.poster_path}`}
                          alt={sim.title}
                          className="w-full h-[200px] object-cover"
                        />
                        <p className="text-center text-yellow-400 text-sm p-2 truncate">
                          {sim.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
