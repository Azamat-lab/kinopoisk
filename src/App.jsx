
// import React from "react";
// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import Account from "./pages/Account";
// import Login from "./pages/Login";
// import PrivateRoute from "./components/PrivateRoute";
// import Saved from "./pages/Saved";
// import MovieDetail from "./components/MovieDetail";
// import Register from "./pages/Register";
// import Cartoon from "./pages/Cartoon";

// function AppLayout() {
//   const location = useLocation();
//   const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

//   return (
//     <div className="bg-[#0D0D0D] min-h-screen text-white">
//       {!hideNavbar && <Navbar />}

//       <Routes>
//         <Route
//           path="/"
//           element={
//             <PrivateRoute>
//               <Home />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/account"
//           element={
//             <PrivateRoute>
//               <Account />
//             </PrivateRoute>
//           }
//         />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         <Route
//           path="/cartoons"
//           element={
//             <PrivateRoute>
//               <Cartoon />
//             </PrivateRoute>
//           }
//         />

//         <Route path="/saved" element={<Saved />} />
//         <Route path="/movie/:id" element={<MovieDetail />} />
//       </Routes>
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <Router>
//       <AppLayout />
//     </Router>
//   );
// }
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Account from "./pages/Account";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import Saved from "./pages/Saved";
import MovieDetail from "./components/MovieDetail";
import Register from "./pages/Register";
import Cartoon from "./pages/Cartoon";

function AppLayout() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div className="bg-[#0D0D0D] min-h-screen text-white">
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* HOME – login shart emas */}
        <Route path="/" element={<Home />} />

        {/* LOGIN & REGISTER */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* LOGIN QILGANLARGA */}
        <Route
          path="/account"
          element={
            <PrivateRoute>
              <Account />
            </PrivateRoute>
          }
        />

        <Route
          path="/saved"
          element={
            <PrivateRoute>
              <Saved />
            </PrivateRoute>
          }
        />

        <Route
          path="/cartoons"
          element={
            <PrivateRoute>
              <Cartoon />
            </PrivateRoute>
          }
        />

        {/* MOVIE DETAILS → login required */}
        <Route
          path="/movie/:id"
          element={
            <PrivateRoute>
              <MovieDetail />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
