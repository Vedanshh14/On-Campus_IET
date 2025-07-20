/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import FilterSection from "../components/FilterSection";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Home() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorType, setErrorType] = useState(null);

  const page = Number(searchParams.get("page")) || 1;
  const limit = 8;

  // UI-only draft filters
  const [filterDraft, setFilterDraft] = useState({
    companyName: "",
    campusType: "",
    arrivedInSem: "",
    cgpaCriteria: "",
    packageMin: "",
    selectionStatus: ""
  });

  //  On URL change  update filters + fetch blogs
  useEffect(() => {
    const urlFilters = {
      companyName: searchParams.get("companyName") || "",
      campusType: searchParams.get("campusType") || "",
      arrivedInSem: searchParams.get("arrivedInSem") || "",
      cgpaCriteria: searchParams.get("cgpaCriteria") || "",
      packageMin: searchParams.get("packageMin") || "",
      selectionStatus: searchParams.get("selectionStatus") || ""
    };

    setFilterDraft(urlFilters); // Sync filter UI with URL

    fetchBlogs(urlFilters, page);
  }, [searchParams]);

  // ✅ Fetch blogs with filters
  const fetchBlogs = async (filters, pageNum) => {
    try {
      setIsLoading(true);
      setErrorType(null);

      const query = Object.entries(filters)
        .filter(([_, value]) => value !== "")
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");

      const res = await axios.get(
        `${API_BASE}/api/blog/filter?page=${pageNum}&limit=${limit}&${query}`
      );

      setBlogs(res.data.blogs);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      if (!window.navigator.onLine) {
        setErrorType("network");
      } else {
        setErrorType("server");
      }
    } finally {
      setIsLoading(false);
    }
  };

  //  Apply filters (updates URL, which triggers useEffect)
  const applyFilters = () => {
    const newParams = new URLSearchParams();

    Object.entries(filterDraft).forEach(([key, value]) => {
      if (value !== "") newParams.set(key, value);
    });

    newParams.set("page", 1);
    setSearchParams(newParams); // triggers blog fetch
  };

  //  Clear filters
  const clearFilters = () => {
    setSearchParams({ page: 1 });
  };

  //  Pagination
  const goToPage = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    setSearchParams(params); // triggers blog fetch
  };

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
          filters={filterDraft}
          onChange={(key, value) =>
            setFilterDraft((prev) => ({ ...prev, [key]: value }))
          }
          onApply={applyFilters}
          onClear={clearFilters}
        />
      )}

      {/* Blog List */}
      <div className="mt-6 space-y-4">
        {isLoading ? (
          <p className="text-gray-500">Loading blogs...</p>
        ) : errorType === "network" ? (
          <p className="text-red-500">
            No internet connection. Please check your network.
          </p>
        ) : errorType === "server" ? (
          <p className="text-red-500">
            Server is down or unavailable. Kindly reach us out at{" "}
            on.campus.iet.davv@gmail.com
          </p>
        ) : blogs.length === 0 ? (
          <p className="text-gray-500">
            No experiences found matching your filters.
          </p>
        ) : (
          blogs.map((blog) => (
            <Link to={`/blog/${blog._id}`} key={blog._id}>
              <div className="border-b-zinc-600 rounded mt-6 p-4 shadow-sm bg-white">
                <h3 className="text-lg ">{blog.companyName}</h3>
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
                  <img
                    src="/upvote.svg"
                    alt="upvote icon"
                    className="h-4 w-4"
                  />
                  <span>{blog.upvotes}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6 text-sm sm:text-base">
        <button
          onClick={() => goToPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img src="/prevPage.png" alt="Previous" className="h-6 w-6" />
        </button>

        <span className="font-medium">
          {page} / {totalPages}
        </span>

        <button
          onClick={() => goToPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img src="/nextPage.png" alt="Next" className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}