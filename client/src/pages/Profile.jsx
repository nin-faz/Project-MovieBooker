import { useNavigate } from "react-router-dom";
import useProfile from "../hooks/useProfile";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const Profile = () => {
  const navigate = useNavigate();
  const { profile, loading, error } = useProfile();

  if (loading) return <Loader />;
  if (error) toast.error(error);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* <div className="flex items-center justify-center h-96 container mx-auto p-6"> */}
      {/* <button onClick={() => navigate(-1)} className="mb-4 flex items-center">
        <FiArrowLeft className="mr-2" /> Retour
      </button> */}
      <h1 className="text-2xl text-white font-bold mb-6 text-center">
        👤 Profil
      </h1>

      {/* <div className="w-1/2 bg-gray-900 text-white border-2 border-white p-4 rounded-lg shadow-md transition duration-200 hover:shadow-lg hover:bg-gray-800"> */}
      <div className="flex flex-col space-y-4 pl-8 bg-gray-900 text-white border-2 border-white p-4 rounded-lg shadow-md transition duration-200 hover:shadow-lg hover:bg-gray-800">
        <p>Prénom: {profile.firstName}</p>
        <p>Email: {profile.email}</p>
      </div>
    </div>
  );
};

export default Profile;
