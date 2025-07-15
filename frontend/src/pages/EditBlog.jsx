import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    postAsAnonymous: false,
    campusType: "",
    arrivedInSem: "",
    cgpaCriteria: "",
    packageIntern: "",
    packageFullTime: "",
    selectionStatus: "",
    experience: "",
  });

  const [message, setMessage] = useState("");

  // ✅ Fetch blog on mount
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${API_BASE}/api/blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const blog = res.data.blog;
        setFormData({
          companyName: blog.companyName,
          postAsAnonymous: blog.postAsAnonymous,
          campusType: blog.campusType,
          arrivedInSem: blog.arrivedInSem,
          cgpaCriteria: blog.cgpaCriteria || "",
          packageIntern: blog.packageIntern || "",
          packageFullTime: blog.packageFullTime || "",
          selectionStatus: blog.selectionStatus,
          experience: blog.experience,
        });
      })
      .catch((err) => {
        console.error("Error fetching blog:", err);
        setMessage("Error loading blog for editing.");
      });
  }, [id]);

  // ✅ Input handler
  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(`${API_BASE}/api/blog/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/profile");
    } catch (err) {
      console.error("Update error:", err);
      setMessage("Failed to update blog.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mt-6 mx-auto bg-white shadow rounded">
      <h1 className="text-2xl mb-4">Edit Your Experience</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company - disabled */}
        <div>
          <label className="block mb-1 font-light">Company Name</label>
          <input
            type="text"
            value={formData.companyName}
            disabled
            className="w-full border p-2 rounded bg-gray-100 text-gray-700"
          />
        </div>

        {/* Anonymous */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="postAsAnonymous"
            checked={formData.postAsAnonymous}
            onChange={handleInput}
          />
          <label className="text-sm">Post as Anonymous</label>
        </div>

        {/* Campus Type */}
        <div>
          <label className="block mb-1 font-light">Campus Type</label>
          <select
            name="campusType"
            value={formData.campusType}
            onChange={handleInput}
            required
            className="w-full font-thin border p-2 rounded"
          >
            <option value="">Select</option>
            <option value="on-campus">On Campus</option>
            <option value="off-campus">Off Campus</option>
          </select>
        </div>

        {/* Semester */}
        <div>
          <label className="block mb-1 font-light">Semester You Appeared In</label>
          <select
            name="arrivedInSem"
            value={formData.arrivedInSem}
            onChange={handleInput}
            required
            className="w-full font-thin border p-2 rounded"
          >
            <option value="">Select</option>
            {[4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>

        {/* CGPA */}
        <div>
          <label className="block mb-1 font-light">CGPA Criteria</label>
          <select
            name="cgpaCriteria"
            value={formData.cgpaCriteria}
            onChange={handleInput}
            className="w-full border p-2 rounded font-thin"
          >
            <option value="">Not Known</option>
            {[5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Packages */}
        <div>
          <label className="block mb-1 font-light">Intern Stipend (₹ / month)</label>
          <input
            type="number"
            name="packageIntern"
            value={formData.packageIntern}
            onChange={handleInput}
            onWheel={(e) => e.target.blur()}
            className="w-full border p-2 rounded font-thin"
            placeholder="Leave empty if not applicable"
          />
        </div>
        <div>
          <label className="block mb-1 font-light">Full-Time Package (₹ / year)</label>
          <input
            type="number"
            name="packageFullTime"
            value={formData.packageFullTime}
            onChange={handleInput}
            onWheel={(e) => e.target.blur()}
            className="w-full border p-2 rounded font-thin"
            placeholder="Leave empty if not applicable"
          />
        </div>

        {/* Selection Status */}
        <div>
          <label className="block mb-1 font-light">Selection Status</label>
          <select
            name="selectionStatus"
            value={formData.selectionStatus}
            onChange={handleInput}
            required
            className="w-full border font-thin p-2 rounded"
          >
            <option value="">Select</option>
            <option value="selected">Selected</option>
            <option value="notselected">Not Selected</option>
          </select>
        </div>

        {/* Experience */}
        <div>
          <label className="block mb-1 font-light">Your Experience</label>
          <textarea
            name="experience"
            value={formData.experience}
            onChange={handleInput}
            rows={20}
            required
            placeholder="Write in detail, minimum 50 words..."
            className="w-full font-light border p-2 rounded"
          />
        </div>

        {message && <p className="text-sm text-red-500">{message}</p>}

        <button
          type="submit"
          className="mt-4 cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}