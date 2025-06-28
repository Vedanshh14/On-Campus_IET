import { useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    batch: "",
    linkedin: "",
    contact: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password.length < 8) {
        setMessage("Password must be at least 8 characters long");
        return;
      }
      if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email)) {
        setMessage("Only valid Gmail addresses are allowed.");
        return;
      }
      if (
        formData.linkedin &&
        !/^https:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?$/.test(
          formData.linkedin
        )
      ) {
        setMessage("Please enter a valid LinkedIn profile URL.");
        return;
      }

      const res = await axios.post(`${API_BASE}/api/auth/signup`, formData);

      // ✅ Store the token
      const token = res.data.token;
      localStorage.setItem("token", token);

      setMessage("Signup successful");

      // ✅ Redirect after 1.5 seconds
      setTimeout(() => {
        navigate(from);
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 mb-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create an Account</h2>
      <p className="mb-4 font-light text-gray-600">Just few credentials:</p>
      {message && <p className="mb-4 text-red-600">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Input fields */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />
        <select
          name="batch"
          required
          className="w-full border p-2 rounded "
          onChange={handleChange}
        >
          <option value="">Select Batch</option>
          {Array.from(
            { length: new Date().getFullYear() + 4 - 2015 + 1 },
            (_, i) => (
              <option key={i} value={2015 + i}>
                {2015 + i}
              </option>
            )
          )}
        </select>
        <select
          name="branch"
          required
          className="w-full border p-2 rounded"
          onChange={handleChange}
        >
          <option value="">Select Branch</option>
          {["CSE", "CSBS", "IT", "ETC", "EI", "Mech", "Civil"].map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="linkedin"
          placeholder="LinkedIn ID"
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />
        <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          required
          className="w-full border p-2 rounded"
          onChange={handleChange}
        />
        <img
          src={showPassword ? "/seePassword.png" : "/notSeePassword.png"}
          alt="Toggle Password"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 cursor-pointer"
          onClick={() => setShowPassword(prev => !prev)}
        />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white cursor-pointer py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
      <p className="text-sm mt-4 text-center">
        Already have an account?{" "}
        <Link
          to="/login"
          state={{ from }}
          className="text-blue-600 hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
