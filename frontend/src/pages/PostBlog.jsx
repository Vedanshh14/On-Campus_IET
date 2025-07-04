import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function PostBlog() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch companies on mount
  useEffect(() => {
    axios.get(`${API_BASE}/api/companies/all`)
      .then(res => setCompanies(res.data.companies))
      .catch(err => console.error("Error fetching companies:", err));
  }, []);

  // Handle adding a new company
  const handleAddCompany = async () => {
    if (!newCompany.trim()) return;

    try {
      const res = await axios.post(`${API_BASE}/api/companies/add`, {
        name: newCompany.trim()
      });
      setMessage("Company added successfully");
      setCompanies(prev => [...prev, res.data.company]);
      setSelectedCompany(res.data.company);
      setNewCompany("");
      setAdding(false);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error adding company");
    }
  };

  return (
    <div className="p-6 max-w-3xl mt-6 mx-auto bg-white shadow rounded">
      <h1 className="text-2xl mb-4">Add Your Experience</h1>
      <p className="font-light mb-4">
        It only takes a few minutes! Your experience will help other job seekers.
      </p>

      {/* Company Dropdown */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Company Name</label>
        <select
          value={selectedCompany}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedCompany(value);
            if (value === "Other") {
              setAdding(true);
            } else {
              setAdding(false);
              setNewCompany("");
              setMessage("");
            }
          }}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Select</option>
          {companies.map((company, idx) => (
            <option key={idx} value={company}>{company}</option>
          ))}
          <option value="Other">Other (Add new company)</option>
        </select>
      </div>

      {/* New Company Input */}
      {adding && (
        <div className="mb-4">
          <label className="block mb-1 text-sm text-gray-600">
            Please enter the new company name in a standard format:
          </label>
          <input
            type="text"
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., Atlassian"
          />
          <button
            onClick={handleAddCompany}
            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Add Company
          </button>
          {message && <p className="text-sm mt-2 text-green-600">{message}</p>}
        </div>
      )}
    </div>
  );
}