import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function PostBlog() {
  const [companies, setCompanies] = useState([]);
  

  const [selectedCompany, setSelectedCompany] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [adding, setAdding] = useState(false);

  const [formData, setFormData] = useState({
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
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/companies/all`)
      .then((res) => setCompanies(res.data.companies))
      .catch((err) => console.error("Error fetching companies:", err));
  }, []);

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const selectedName =
      selectedCompany === "Other" ? newCompany.trim() : selectedCompany;

    if (!selectedName) {
      return setMessage("Please select or enter a company name.");
    }

    if (formData.experience.trim().split(/\s+/).length < 50) {
      return setMessage("Experience must be at least 50 words.");
    }

    const token = localStorage.getItem("token");
    if (!token) return setMessage("You must be logged in.");

    try {
      const res = await axios.post(
        `${API_BASE}/api/blog/add`,
        {
          ...formData,
          companyName: selectedName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Blog posted successfully!");
      navigate(`/blog/${res.data.blogId}`);
    } catch (err) {
      console.error("Error submitting blog:", err);
      setMessage(err.response?.data?.message || "Submission failed.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mt-6 mx-auto bg-white shadow rounded">
      <h1 className="text-2xl mb-4">Add Your Experience</h1>
      <p className="font-extralight mb-4">
        It only takes a few minutes! Your experience will help other job seekers.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Company Dropdown */}
        <div>
          <label className="block font-light mb-1">Company Name</label>
          <select
          
            value={selectedCompany}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedCompany(val);
              if (val === "Other") {
                setAdding(true);
              } else {
                setAdding(false);
                setNewCompany("");
              }
            }}
            className="w-full font-thin border p-2 rounded"
            required
          >
            <option value="">Select</option>
            {companies.map((company, idx) => (
              <option key={idx} value={company}>
                {company}
              </option>
            ))}
            <option value="Other">Other (Add new company)</option>
          </select>
        </div>

        {adding && (
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Enter company name (standard format):
            </label>
            <input
              type="text"
              className="w-full font-thin border p-2 rounded"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              placeholder="e.g., Atlassian"
              required
            />
          </div>
        )}

        {/* Anonymous Checkbox */}
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
          <label className="block  mb-1 font-light">CGPA Criteria (if known)</label>
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
            min="0"
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
            min="0"
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
          Add Blog
        </button>
      </form>
    </div>
  );
}