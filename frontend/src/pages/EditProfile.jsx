import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function EditProfile() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    branch: "",
    batch: "",
    linkedin: "",
    contact: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${API_BASE}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = res.data.user;
        setFormData({
          name: user.name,
          email: user.email,
          branch: user.branch,
          batch: user.batch,
          linkedin: user.linkedin || "",
          contact: user.contact || "",
        });
      } catch (err) {
        console.error("Error fetching user profile", err);
        setMessage("Failed to load profile.");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`${API_BASE}/api/user/profile`, formData, {
  headers: { Authorization: `Bearer ${token}` },
});
      setMessage("Profile updated successfully!");

      setTimeout(() => {
      navigate("/profile");
    }, 1000);
    } catch (err) {
      console.error("Update error:", err);
      setMessage("Failed to update profile.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mt-5 mx-auto bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Edit Your Profile</h1>
      {message && <p className="text-sm text-red-600 mb-2">{message}</p>}

      <div className="space-y-4">
        {/* Name */}
        <input
          type="text"
          name="name"
          value={formData.name}
          disabled
          className="w-full border p-2 rounded bg-gray-100 text-gray-600"
        />

        {/* Email */}
   <input
  type="email"
  name="email"
  value={formData.email}
  onChange={handleChange}
  className="w-full border p-2 rounded"
/>
        {/* Branch */}
        <select
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Branch</option>
          {["CSE", "CSBS", "IT", "ETC", "EI", "Mech", "Civil"].map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        {/* Batch */}
        <select
          name="batch"
          value={formData.batch}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Batch</option>
          {Array.from({ length: 15 }, (_, i) => 2015 + i).map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        {/* LinkedIn */}
        <input
          type="text"
          name="linkedin"
          value={formData.linkedin}
          placeholder={formData.linkedin ? "LinkedIn URL" : "You didn’t provide it yet"}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        

        {/* Save Changes */}
        <button
          onClick={handleSave}
          className="w-full mt-4 cursor-pointer bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}