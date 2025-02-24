import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../services/authService";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const { authLogin } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const { token } = await login(formData.email, formData.password);

        if (token) {
          authLogin({ token, user: {} });
          toast.success("Connexion réussie !");
          navigate("/");
        } else {
          throw new Error("Le token est manquant.");
        }
      } else {
        await register(formData);
        toast.success("Inscription réussie !");
        setIsLogin(true);
      }
    } catch (err) {
      console.error("Erreur : ", err);

      const errorMessage = err.message || "Une erreur est survenue.";

      const existingToasts = document.querySelectorAll(".Toastify__toast");
      const isAlreadyShown = [...existingToasts].some((toast) =>
        toast.innerText.includes(errorMessage)
      );

      if (!isAlreadyShown) {
        toast.error(errorMessage);
      }
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    document.title = isLogin ? "Connexion" : "Inscription";
  }, [isLogin]);

  return (
    <div className="flex items-center justify-center min-h-screen py-8 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl border border-gray-200 transform transition duration-300 hover:scale-105">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {isLogin ? "Connexion" : "Inscription"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="relative">
              <input
                type="text"
                name="firstName"
                placeholder="Prénom"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition duration-200"
                required
              />
            </div>
          )}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition duration-200"
              required
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition duration-200"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-2/4 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white font-semibold bg-indigo-500 rounded-lg hover:bg-indigo-600 transition duration-300 shadow-md"
          >
            {isLogin ? "Se connecter" : "S'inscrire"}
          </button>
        </form>
        <p className="text-center text-gray-600">
          {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-500 font-semibold hover:underline"
          >
            {isLogin ? "Inscrivez-vous" : "Connectez-vous"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
