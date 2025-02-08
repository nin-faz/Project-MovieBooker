import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="bg-gray-800 text-white py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          🎥 MovieBooking
        </h1>
        <nav className="space-x-4">
          <a href="/" className="hover:text-yellow-500">
            Accueil
          </a>
          <a href="/reservations" className="hover:text-yellow-500">
            Réservations
          </a>
          <a href="/contact" className="hover:text-yellow-500">
            Contact
          </a>
          {user ? (
            <button
              onClick={logout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Déconnexion
            </button>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
            >
              Connexion / Inscription
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
