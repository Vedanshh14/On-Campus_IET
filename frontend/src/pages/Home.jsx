/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import FilterSection from "../components/FilterSection";
import { Link } from "react-router-dom";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Home() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    companyName: "",
    campusType: "",
    arrivedInSem: "",
    cgpaCriteria: "",
    packageMin: "",
    selectionStatus: "",
  });

  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8; // blogs per page,change to 15 later

  const fetchBlogs = async () => {
    try {
      const query = Object.entries(filters)
        .filter(([_, value]) => value !== "")
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");
      console.log("a");

      const res = await axios.get(
        `${API_BASE}/api/blog/filter?page=${page}&limit=${limit}&${query}`
      );
      console.log("b");
      setBlogs(res.data.blogs);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      console.log("c");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  return (
    <div className="px-4 py-4">
      {/* Toggle Filter Button */}
      <button
        className="mb-4 px-4 py-2 cursor-pointer bg-black text-white rounded hover:bg-blue-700 transition"
        onClick={() => setShowFilters((prev) => !prev)}
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>

      {/* Conditionally Render Filters */}
      {showFilters && (
        <FilterSection
          filters={filters}
          setFilters={setFilters}
          setPage={setPage}
          onApply={fetchBlogs}
        />
      )}

      {/* Blog List */}

      <div className="mt-6 space-y-4">
        {blogs.length === 0 ? (
          <p className="text-gray-500">Sorry, no experience available.</p>
        ) : (
          blogs.map((blog) => (
            <Link to={`/blog/${blog._id}`} key={blog._id}>
              <div
                key={blog._id}
                className="border-b-zinc-600 rounded mt-6 p-4 shadow-sm bg-white"
              >
                <h3 className="text-lg font-semibold">{blog.companyName}</h3>
                <p className="text-sm text-gray-500">
                  {blog.packageFullTime ? (
                    <span className="text-green-600">
                      {(blog.packageFullTime / 100000).toFixed(1)} LPA
                    </span>
                  ) : null}
                  {blog.packageFullTime && " • "}
                  {blog.campusType} •{" "}
                  {blog.arrivedInSem && `Sem ${blog.arrivedInSem}`}
                </p>
                <span className="text-sm text-gray-500">
                  Written By:{" "}
                  {blog.postAsAnonymous ? (
                    <span className="inline-flex items-center gap-1">
                      Anonymous
                      <img
                        src="/anonymous.png"
                        alt="anonymous_img"
                        className="h-4 inline-block"
                      />
                    </span>
                  ) : (
                    blog.user.name
                  )}
                </span>
                <p className="mt-2 text-gray-700">
  {blog.experience.split(" ").slice(0, 20).join(" ")}
  <span className="text-blue-500">...Read more</span>
</p>
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-2 cursor-text">
                  {/* <span>Upvotes:</span> */}
                  <img src="/upvoted.svg" alt="upvote icon" className="h-4 w-4" />
                  <span className="">{blog.upvotes}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6 text-sm sm:text-base">
        {/* Prev Button */}
        <button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img src="/prevPage.png" alt="Previous" className="h-6 w-6" />
        </button>

        {/* Page Count */}
        <span className="font-medium">
          {page} / {totalPages}
        </span>

        {/* Next Button */}
        <button
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page === totalPages}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img src="/nextPage.png" alt="Next" className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
//implement blog opening functionality,
// add selected/not selected
//add login/signup/password reset routes
