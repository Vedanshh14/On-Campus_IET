import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <p className="text-gray-600 mb-4">This is the Profile page.</p>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}