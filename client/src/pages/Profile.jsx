import useProfile from "../hooks/useProfile";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { useEffect } from "react";

const Profile = () => {
  const { profile, loading, error } = useProfile();

  useEffect(() => {
    document.title = "Profil";
  }, []);

  if (loading) return <Loader />;
  if (error) {
    toast.error(error);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl text-white font-bold mb-6 text-center">
        👤 Profil
      </h1>

      <div className="flex flex-col space-y-4 pl-8 bg-gray-900 text-white border-2 border-white p-4 rounded-lg shadow-md transition duration-200 hover:shadow-lg hover:bg-gray-800">
        <p>Prénom: {profile.firstName}</p>
        <p>Email: {profile.email}</p>
      </div>
    </div>
  );
};

export default Profile;
