import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Profile() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You are not logged in");
      return;
    }

    //  Fetch profile first
    axios
      .get(`${API_BASE}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.user);

        return axios.get(`${API_BASE}/api/blog/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => {
        setBlogs(res.data.blogs);
      })
      .catch((err) => {
        console.log("catch block");
        console.error("Error fetching profile or blogs:", err);
        setMessage("Error loading profile or blogs");
      });
  }, []);
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      navigate("/");
    }
  };
  const handleEditProfile = () => {
    navigate("/editProfile");
  };

  const handleAdd = () => {
    navigate("/post");
  };
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    axios
      .delete(`${API_BASE}/api/blog/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
      })
      .catch((err) => {
        console.error("Could not delete blog:", err);
      });
  };
  const handleEdit = (id) => {
    navigate(`/editBlog/${id}`);
  };
  if (message) return <div className="p-6 text-red-600">{message}</div>;

  if (!user) return <div className="p-6">User not found</div>;

  return (
    <div className="p-6 max-w-3xl mt-5 mx-auto bg-white shadow rounded">
      <p className="text-2xl mb-1">Welcome, {user.name}</p>

      <div className="flex items-center gap-2 text-gray-700 text-sm mb-2">
        <span>
          {user.branch}, {user.batch}
        </span>

        <div className="flex items-center gap-3">
          {user.linkedin && (
            <a
              href={user.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              title={user.linkedin}
            >
              <img src="/linkedin.png" alt="LinkedIn" className="h-4 w-4" />
            </a>
          )}

          {user.email && (
            <a href={`mailto:${user.email}`} title={user.email}>
              <img src="/gmail.png" alt="Gmail" className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={handleEditProfile}
          className="flex items-center gap-2 px-2 py-1 border border-gray-400 cursor-pointer text-sm rounded hover:bg-gray-100 transition"
        >
          <img src="/write-blog.png" alt="Write Blog" className="h-4 w-4" />
          Edit Profile
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center text-red-500 gap-2 px-2 py-1 border border-red-400 cursor-pointer text-sm rounded hover:bg-red-100 transition"
        >
          <img src="/logout.png" alt="Logout" className="h-4 w-4" />
          Logout
        </button>
      </div>

      <hr className="my-6 border-t border-gray-300" />
      <div className="flex items-center gap-4 mt-6">
        <span className="font-light">My experiences: {user.blogsWritten}</span>
        <button
          onClick={handleAdd}
          className="flex items-center rounded text-white gap-2 px-3 py-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-sm"
        >
          <img src="/plus.png" alt="Add" className="h-3 w-3" />
          Add
        </button>
      </div>
      <div className="mt-6 space-y-4">
        {blogs.length === 0 ? (
          <p className="text-gray-500 font-light">No experience posted yet.</p>
        ) : (
          blogs.map((blog) => (
            <div
              key={blog._id}
              className="border-b-zinc-600 rounded mt-6 p-4 shadow-sm bg-white"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{blog.companyName}</h3>
                <div className="ml-2 flex gap-[4px]">
                  <button
                    onClick={() => handleEdit(blog._id)}
                    className="p-1 cursor-pointer rounded-md hover:border hover:border-gray-300"
                  >
                    <img
                      className="h-4 w-4"
                      src="/write-blog.png"
                      alt="edit icon"
                    />
                  </button>
                  <button
                    onClick={() => handleDelete(blog._id)}
                    className="p-1 cursor-pointer rounded-md hover:border hover:border-gray-300"
                  >
                    <img
                      className="h-4 w-4"
                      src="/delete.png"
                      alt="delete icon"
                    />
                  </button>
                </div>
              </div>

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

              <p className="mt-2 text-gray-700">
                {blog.experience.split(" ").slice(0, 20).join(" ")}{" "}
                <Link
                  to={`/blog/${blog._id}`}
                  className="text-blue-500 hover:underline"
                >
                  ...Read more
                </Link>
              </p>
              <div className="flex items-center gap-1 text-sm text-gray-600 mt-2 cursor-text">
                {/* <span>Upvotes:</span> */}
                <img src="/upvote.svg" alt="upvote icon" className="h-4 w-4" />
                <span className="">{blog.upvotes.length}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
