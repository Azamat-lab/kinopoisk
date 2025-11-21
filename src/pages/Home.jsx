
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const API_KEY = "c331e966af5c9e27ef3b804f938f6db3";

  const [nowPlaying, setNowPlaying] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [popular, setPopular] = useState([]);

  const [pageNowPlaying, setPageNowPlaying] = useState(1);
  const [totalPagesNowPlaying, setTotalPagesNowPlaying] = useState(1);

  const [pageTopRated, setPageTopRated] = useState(1);
  const [totalPagesTopRated, setTotalPagesTopRated] = useState(1);

  const [pagePopular, setPagePopular] = useState(1);
  const [totalPagesPopular, setTotalPagesPopular] = useState(1);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [credits, setCredits] = useState([]);
  const [videos, setVideos] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [tempMovie, setTempMovie] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const [nowRes, topRes, popRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&page=${pageNowPlaying}`),
          axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&page=${pageTopRated}`),
          axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&page=${pagePopular}`)
        ]);

        setNowPlaying(nowRes.data.results.filter(m => !m.genre_ids.includes(16)));
        setTotalPagesNowPlaying(Math.min(nowRes.data.total_pages, 500));

        setTopRated(topRes.data.results.filter(m => !m.genre_ids.includes(16)));
        setTotalPagesTopRated(Math.min(topRes.data.total_pages, 500));

        setPopular(popRes.data.results.filter(m => !m.genre_ids.includes(16)));
        setTotalPagesPopular(Math.min(popRes.data.total_pages, 500));
      } catch (e) {
        console.error("Xatolik!", e);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [pageNowPlaying, pageTopRated, pagePopular]);

  const checkLoginStatus = () => {
    return localStorage.getItem("isLoggedIn") === "true";
  };

  const openModal = async (movie) => {
    if (!checkLoginStatus()) {
      setTempMovie(movie);
      setShowLoginModal(true);
      return;
    }

    setSelectedMovie(movie);
    try {
      const [creditsRes, videoRes, recRes, simRes] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${API_KEY}`),
        axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`),
        axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/recommendations?api_key=${API_KEY}`),
        axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/similar?api_key=${API_KEY}`)
      ]);

      setCredits(creditsRes.data.cast.slice(0, 10));
      setVideos(videoRes.data.results);
      setRecommendations(recRes.data.results.slice(0, 6));
      setSimilarMovies(simRes.data.results.slice(0, 6));

    } catch (e) {
      console.error(e);
    }
  };

  const closeModal = () => setSelectedMovie(null);

  const saveMovie = (movie) => {
    if (!checkLoginStatus()) {
      setTempMovie(movie);
      setShowLoginModal(true);
      return;
    }

    const saved = JSON.parse(localStorage.getItem("savedMovies")) || [];
    if (!saved.some(m => m.id === movie.id)) {
      saved.push(movie);
      localStorage.setItem("savedMovies", JSON.stringify(saved));
      alert("🎬 Kino saqlandi!");
    } else alert("✅ Bu kino allaqachon saqlangan!");
  };

  const handleLogin = () => {
    setShowLoginModal(false);
    navigate("/login");
  };

  const handleCancel = () => {
    setShowLoginModal(false);
    setTempMovie(null);
  };

  const MovieGrid = ({ movies }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {movies.map(movie => (
        <div key={movie.id} onClick={() => openModal(movie)} className="cursor-pointer bg-[#1a1a1a] rounded-lg overflow-hidden hover:bg-[#2a2a2a] transition relative">
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-full h-[300px] object-cover" />
          <div className="p-3 text-center">
            <h3 className="text-yellow-400 font-semibold truncate">{movie.title}</h3>
            <p className="text-sm text-gray-400">⭐ {movie.vote_average?.toFixed(1)}</p>
          </div>
          <img 
            onClick={e => { 
              e.stopPropagation(); 
              saveMovie(movie); 
            }} 
            src="https://cdn-icons-png.flaticon.com/512/2791/2791383.png" 
            alt="save" 
            className="absolute top-3 left-3 w-7 h-7 hover:scale-110 transition" 
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white p-4 sm:p-6">
      <div className="max-w-[1200px] mx-auto w-full">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6">Now Playing:</h2>
        {loading ? <p className="text-center text-yellow-400">Yuklanmoqda...</p> : <MovieGrid movies={nowPlaying} />}
        <div className="flex justify-center items-center gap-6 mt-4">
          <button disabled={pageNowPlaying === 1} onClick={() => setPageNowPlaying(p => p - 1)} className={`px-4 py-2 rounded-md ${pageNowPlaying === 1 ? "bg-gray-600 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-400"} text-black font-semibold transition`}>← Oldingi</button>
          <span className="text-yellow-400 font-medium">{pageNowPlaying} / {totalPagesNowPlaying}</span>
          <button disabled={pageNowPlaying === totalPagesNowPlaying} onClick={() => setPageNowPlaying(p => p + 1)} className={`px-4 py-2 rounded-md ${pageNowPlaying === totalPagesNowPlaying ? "bg-gray-600 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-400"} text-black font-semibold transition`}>Keyingi →</button>
        </div>

        <h2 className="text-3xl font-bold text-yellow-400 my-6">Top Rated:</h2>
        {loading ? <p className="text-center text-yellow-400">Yuklanmoqda...</p> : <MovieGrid movies={topRated} />}
        <div className="flex justify-center items-center gap-6 mt-4">
          <button disabled={pageTopRated === 1} onClick={() => setPageTopRated(p => p - 1)} className={`px-4 py-2 rounded-md ${pageTopRated === 1 ? "bg-gray-600 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-400"} text-black font-semibold transition`}>← Oldingi</button>
          <span className="text-yellow-400 font-medium">{pageTopRated} / {totalPagesTopRated}</span>
          <button disabled={pageTopRated === totalPagesTopRated} onClick={() => setPageTopRated(p => p + 1)} className={`px-4 py-2 rounded-md ${pageTopRated === totalPagesTopRated ? "bg-gray-600 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-400"} text-black font-semibold transition`}>Keyingi →</button>
        </div>

        <h2 className="text-3xl font-bold text-yellow-400 my-6">Popular:</h2>
        {loading ? <p className="text-center text-yellow-400">Yuklanmoqda...</p> : <MovieGrid movies={popular} />}
        <div className="flex justify-center items-center gap-6 mt-4">
          <button disabled={pagePopular === 1} onClick={() => setPagePopular(p => p - 1)} className={`px-4 py-2 rounded-md ${pagePopular === 1 ? "bg-gray-600 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-400"} text-black font-semibold transition`}>← Oldingi</button>
          <span className="text-yellow-400 font-medium">{pagePopular} / {totalPagesPopular}</span>
          <button disabled={pagePopular === totalPagesPopular} onClick={() => setPagePopular(p => p + 1)} className={`px-4 py-2 rounded-md ${pagePopular === totalPagesPopular ? "bg-gray-600 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-400"} text-black font-semibold transition`}>Keyingi →</button>
        </div>

        {selectedMovie && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
            <div className="bg-[#1a1a1a] p-8 rounded-lg w-11/12 md:w-3/4 lg:w-1/2 relative overflow-y-auto max-h-[90vh]">
              <button onClick={closeModal} className="absolute top-4 right-4 text-white text-3xl font-bold">&times;</button>
              <h3 className="text-3xl font-bold text-yellow-400 mb-4 text-center">{selectedMovie.title}</h3>
              <div className="text-center mb-6">
                <a href={`https://www.google.com/search?q=${encodeURIComponent(selectedMovie.title + " full movie")}`} target="_blank" rel="noopener noreferrer" className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg transition">🔍 Google'da to'liq videoni qidirish</a>
              </div>
              {videos.length > 0 ? <iframe width="100%" height="315" src={`https://www.youtube.com/embed/${videos[0].key}`} title="Trailer" className="rounded-lg mb-4" allowFullScreen></iframe> : <p className="text-center text-gray-400 mb-4">🎞️ Trailer topilmadi</p>}
              <p className="text-gray-300 mb-6 text-center">{selectedMovie.overview}</p>

              {credits.length > 0 && (<div><h4 className="text-2xl text-yellow-400 mb-4">Aktyorlar</h4><div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-8">{credits.map(a => (<div key={a.id} className="text-center"><img src={a.profile_path ? `https://image.tmdb.org/t/p/w300${a.profile_path}` : "https://via.placeholder.com/150"} className="w-24 h-32 mx-auto rounded-md object-cover" /><p className="text-sm text-yellow-400 mt-2">{a.name}</p></div>))}</div></div>)}

              {recommendations.length > 0 && (<div><h4 className="text-2xl text-yellow-400 mb-4">Sizga yoqishi mumkin 🎬</h4><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">{recommendations.map(rec => (<div key={rec.id} onClick={() => openModal(rec)} className="cursor-pointer bg-[#2a2a2a] rounded-lg overflow-hidden hover:bg-[#3a3a3a] transition"><img src={`https://image.tmdb.org/t/p/w500${rec.poster_path}`} alt={rec.title} className="w-full h-[200px] object-cover" /><p className="text-center text-yellow-400 text-sm p-2 truncate">{rec.name || rec.title}</p></div>))}</div></div>)}

              {similarMovies.length > 0 && (<div><h4 className="text-2xl text-yellow-400 mb-4">Oxshash kinolar 🎬</h4><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">{similarMovies.map(sim => (<div key={sim.id} onClick={() => openModal(sim)} className="cursor-pointer bg-[#2a2a2a] rounded-lg overflow-hidden hover:bg-[#3a3a3a] transition"><img src={`https://image.tmdb.org/t/p/w500${sim.poster_path}`} alt={sim.title} className="w-full h-[200px] object-cover" /><p className="text-center text-yellow-400 text-sm p-2 truncate">{sim.title}</p></div>))}</div></div>)}

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
      </div>
    </div>
  );
}