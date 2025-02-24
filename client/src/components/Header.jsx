import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiClock, FiFilm, FiMenu, FiUser, FiX } from "react-icons/fi";
import { toast } from "react-toastify";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo & Nom du site */}
        <button
          className="text-2xl font-bold flex items-center space-x-2"
          onClick={() => navigate("/")}
        >
          🎥{" "}
          <span className="hover:text-yellow-500 transition">MovieBooking</span>
        </button>

        <button onClick={() => setIsMenuOpen(true)}>
          <FiMenu size={28} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 w-64 bg-gray-800 text-white transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 shadow-lg z-50 h-full flex flex-col`}
      >
        <div className="flex justify-between items-center p-4">
          <h2 className="text-lg font-semibold w-full">Menu</h2>
          <button onClick={() => setIsMenuOpen(false)}>
            <FiX size={24} />
          </button>
        </div>

        <nav className="flex flex-col justify-center items-center space-y-4">
          <div className="p-4 text-center border-t border-b border-gray-700 w-full">
            <button
              onClick={() => {
                navigate("/");
                setIsMenuOpen(false);
              }}
              className="hover:text-yellow-500 transition"
            >
              Accueil
            </button>
          </div>
          {/* Paramètres */}
          <div className="p-4 w-full">
            <h3 className="text-sm text-gray-300">Paramètres</h3>
            <button
              className="w-full bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition shadow-md"
              onClick={() => console.log("Mode sombre activé")}
            >
              🌙 Mode sombre
            </button>
          </div>

          {/* Support & Contact */}
          <div className="p-4 border-t border-gray-700 w-full">
            <h3 className="text-sm text-gray-300">Besoin d'aide ?</h3>
            <button
              onClick={() => navigate("/support")}
              className="hover:text-yellow-500 transition"
            >
              Contact & Support
            </button>
          </div>
        </nav>

        {/* Profil Utilisateur avec Avatar */}
        {user && (
          <div className="flex flex-col space-y-5 p-4 border-t border-gray-700">
            <button
              onClick={() => {
                navigate("/profile");
                setIsMenuOpen(false);
              }}
              className="flex items-center justify-center w-full hover:text-yellow-500 transition"
            >
              <FiUser size={24} />
              <span className="space-x-5 px-2"> Voir son profil </span>
            </button>

            <button
              onClick={() => {
                navigate("/my-reservations");
                setIsMenuOpen(false);
              }}
              className="flex items-center justify-center hover:text-yellow-500 transition"
            >
              <FiFilm size={20} />
              <span className="space-x-5 px-2"> Mes réservations </span>
            </button>

            <button
              onClick={() => {
                navigate("/my-reservations-history");
                setIsMenuOpen(false);
              }}
              className="flex items-center justify-center hover:text-yellow-500 transition"
            >
              <FiClock size={24} />
              <span className="space-x-5 px-2"> Historique passées </span>
            </button>
          </div>
        )}

        {/* Boutons Auth */}
        <div className="p-4 border-t border-gray-700 mt-auto">
          {user ? (
            <button
              onClick={() => {
                logout();
                toast.success("Déconnexion réussie !");
                setIsMenuOpen(false);
              }}
              className="w-full bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition shadow-md"
            >
              Déconnexion
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("/auth");
                setIsMenuOpen(false);
              }}
              className="w-full bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition shadow-md"
            >
              Connexion / Inscription
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
