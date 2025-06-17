import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full px-4 py-2 border-b border-gray-200 flex justify-between items-center bg-white">
      {/* Left Side: logo */}
      <div className="cursor-pointer" onClick={() => navigate("/")}>
        <img
          src="/oncampus-logo.png"
          alt="OnCampus"
          className="h-9 object-contain"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6 sm:gap-16 md:gap-20">
        {/* "Write a Blog" */}
        <div
          className="group flex items-center gap-2 cursor-pointer transition-transform duration-150 hover:scale-105"
          onClick={() => navigate("/post")}
        >
          {/* Image swap on hover */}
          <img
            src="/write-blog-gray.png"
            alt="Write Blog"
            className="h-6 block group-hover:hidden"
          />
          <img
            src="/write-blog.png"
            alt="Write Blog Hover"
            className="h-6 hidden group-hover:block"
          />
          <span className="hidden sm:inline text-gray-500 group-hover:text-black transition-colors duration-150">
            Add your experience
          </span>
        </div>

        {/* Profile Icon */}
        <div
          className="group cursor-pointer px-4 transition-transform duration-150 hover:scale-110"
          onClick={() => navigate("/profile")}
        >
          {/* Image swap on hover */}
          <img
            src="/profile-icon-gray.png"
            alt="Profile"
            className="h-8 w-8 block group-hover:hidden"
          />
          <img
            src="/profile-icon.png"
            alt="Profile Hover"
            className="h-8 w-8 hidden group-hover:block"
          />
        </div>
      </div>
    </nav>
  );
}
