import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword,setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, formData);
      localStorage.setItem("token", res.data.token); // save JWT
      setMessage("Login successful ✅");
      const from = location.state?.from || "/";
      navigate(from); // takes them to /profile or /post
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed ❌");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Login</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    required
    className="w-full border p-2 rounded pr-10"
    onChange={handleChange}
  />
  <img
    src={showPassword ? "/seePassword.png" : "/notSeePassword.png"}
    alt="Toggle Password"
    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 cursor-pointer"
    onClick={() => setShowPassword((prev) => !prev)}
  />
</div>

<span
  onClick={() => navigate("/forgotPassword")}
  className="text-blue-600 mt-1 block cursor-pointer hover:underline font-light text-sm"
>
  Forgot Password?
</span>
        <button
          type="submit"
          className="w-full bg-black text-white cursor-pointer p-2 rounded hover:bg-gray-800"
        >
          Login
        </button>
      </form>

      {message && <p className="mt-4 text-sm text-red-500">{message}</p>}

      <p className="mt-4 text-sm text-center">
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="text-blue-600 cursor-pointer hover:underline"
        >
          Sign up
        </span>
      </p>
    </div>
  );
}
