import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserProfile } from "../services/authService";

const useProfile = () => {
  const { token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      setLoading(true);
      getUserProfile(token)
        .then((data) => setProfile(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setError("Utilisateur non authentifié");
    }
  }, [token]);

  return { profile, loading, error };
};

export default useProfile;
