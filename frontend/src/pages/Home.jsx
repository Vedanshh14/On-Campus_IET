import { useState } from "react";
import FilterSection from "../components/FilterSection";
// import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE_URL;


export default function Home() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    companyName: "",
    campusType: "",
    arrivedInSem: "",
    cgpaCriteria: "",
    packageFullTimeMin: "",
    selectionStatus: "",
  });
  const [blogs, setBlogs] = useState([]);


  return (
    <div className="px-4 py-4">
      {/* Toggle Button */}
      <button
        className="mb-4 px-4 py-2 cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={() => setShowFilters((prev) => !prev)}
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>

      {/* Conditionally Render Filters */}
      {showFilters && (<FilterSection
          filters = {filters}
          setFilters = {setFilters}
          setBlogs = {setBlogs}
      
      />)}

      {/* Placeholder: blog cards would go below */}
       {/* {console.log(blogs)} */}
       <div className="mt-6 space-y-4">
  {blogs.length === 0 ? (
    <p className="text-gray-500">No blogs found.</p>
  ) : (
    blogs.map((blog) => (
      <div
        key={blog._id}
        className="border rounded p-4 shadow-sm bg-white"
      >
        <h3 className="text-lg font-semibold">
          {blog.postAsAnonymous ? 'Anonymous' : blog.user.name}
        </h3>
        <p className="text-sm text-gray-500">
          {blog.companyName} • {blog.campusType} • {blog.arrivedInSem && `Sem ${blog.arrivedInSem}`}
        </p>
        <p className="mt-2 text-gray-700">{blog.experience}</p>
      </div>
    ))
  )}
</div>
      
    </div>
  );
}
