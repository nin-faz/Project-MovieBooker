import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import MovieDetails from "./pages/MovieDetails";
import MyReservations from "./pages/MyReservations";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import MyReservationsHistory from "./pages/MyReservationsHistory";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <Router>
        <Layout>
          <Routes>
            {/*Public Routes*/}
            <Route path="/" element={<HomePage />} />
            <Route path="/movies/:movieId" element={<MovieDetails />} />
            <Route path="/auth" element={<AuthPage />} />

            {/*Private Routes*/}
            <Route
              path="/my-reservations"
              element={
                <ProtectedRoute>
                  <MyReservations />{" "}
                </ProtectedRoute>
              }
            />
            <Route
              path="my-reservations-history"
              element={
                <ProtectedRoute>
                  <MyReservationsHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Not found Routes */}
            <Route
              path="*"
              element={
                <h1 className="flex items-center justify-center h-screen text-white text-4xl font-bold">
                  404 - Not Found
                </h1>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
