import { useState, useEffect } from "react";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function FilterSection({ filters, onChange, onApply, onClear }) {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/companies/all`)
      .then((res) => {
        setCompanies(res.data.companies);
      })
      .catch((err) => {
        console.error("Error fetching companies: ", err);
      });
  }, []);

  return (
    <div className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-white rounded shadow">
      {/* Company Filter */}
     
      <div>
        <label className="block mb-1 font-medium">Company:</label>
        <select
          value={filters.companyName}
          onChange={(e) => onChange("companyName", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">All</option>
          {companies.map((company, index) => (
            <option key={index} value={company}>
              {company}
            </option>
          ))}
        </select>
      </div>

      {/* Campus Type */}
      <div>
        <label className="block mb-1 font-medium">Campus Type:</label>
        <select
          value={filters.campusType}
          onChange={(e) => onChange("campusType", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Both</option>
          <option value="on-campus">On Campus</option>
          <option value="off-campus">Off Campus</option>
        </select>
      </div>

      {/* Semester */}
      <div>
        <label className="block mb-1 font-medium">Semester:</label>
        <select
          value={filters.arrivedInSem}
          onChange={(e) => onChange("arrivedInSem", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Any</option>
          {[4, 5, 6, 7, 8].map((sem) => (
            <option key={sem} value={sem}>
              {sem}
            </option>
          ))}
        </select>
      </div>

      {/* CGPA */}
      <div>
        <label className="block mb-1 font-medium">CGPA Criteria:</label>
        <select
          value={filters.cgpaCriteria}
          onChange={(e) => onChange("cgpaCriteria", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Any</option>
          {[5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map((cgpa) => (
            <option key={cgpa} value={cgpa}>
              ≤ {cgpa}
            </option>
          ))}
        </select>
      </div>

      {/* Min Package */}
      <div>
        <label className="block mb-1 font-medium">Min Package (LPA):</label>
        <select
          value={filters.packageMin}
          onChange={(e) => onChange("packageMin", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Any</option>
          {[3, 6, 9, 12, 15, 18, 24, 30].map((pkg) => (
            <option key={pkg} value={pkg * 100000}>
              ≥ {pkg} LPA
            </option>
          ))}
        </select>
      </div>

      {/* Selection Status */}
      <div>
        <label className="block mb-1 font-medium">Selection Status:</label>
        <select
          value={filters.selectionStatus}
          onChange={(e) => onChange("selectionStatus", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="">Any</option>
          <option value="selected">Selected</option>
          <option value="notselected">Not Selected</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="col-span-full flex justify-between items-center mt-4">
        {/* Clear Filters */}
        <button
          onClick={onClear}
          className="px-4 py-2 bg-gray-200 text-gray-800 cursor-pointer rounded hover:bg-gray-300 transition"
        >
          Clear Filters
        </button>

        {/* Apply Filters */}
        <button
          onClick={onApply}
          className="px-4 py-2 cursor-pointer bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Apply Filters
        </button>
         <div>This is dev branch</div>
      </div>
    </div>
  );
}