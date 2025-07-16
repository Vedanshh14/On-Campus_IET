import { useLocation,useParams,useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import upvoteIcon from "/upvote.svg";
import upvotedIcon from "/upvoted.svg";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function SingleBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [upvoted,setUpvoted] = useState(false);
  const [upvotes,setUpvotes] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();


 
  
  useEffect(() => {
    axios
      .get(`${API_BASE}/api/blog/${id}`)
      .then((res) => {
        setBlog(res.data.blog);
        //blog has (blog data+user info) both
        setUpvotes(res.data.blog.upvotes.length);

        const token = localStorage.getItem("token");
        if(token){
          const userId = JSON.parse(atob(token.split(".")[1])).id;
          setUpvoted(res.data.blog.upvotes.includes(userId))
        }
      })
      .catch((err) => {
        console.log("Error in fetching single blog: ", err);
      });
  }, [id]);

 const handleUpvote = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/signup", { state: { from: location } });
    return;
  }

  try {
    const res = await axios.post(
      `${API_BASE}/api/blog/${id}/upvote`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setUpvotes(res.data.totalUpvotes);
    setUpvoted(res.data.userHasUpvoted);
  } catch (err) {
    console.error("Upvote Error:", err);
  }
};
  if (!blog) return (<div className="p-6">Blog not found</div>);



  return (
    <div className="p-6 max-w-3xl mx-auto mt-6 mb-6 bg-white shadow rounded">
      <h1 className="text-3xl font-bold mb-2">
        {blog.companyName} ({blog.campusType})
      </h1>
      <p
        className={`text-sm mb-4 ${
          blog.selectionStatus === "selected"
            ? "text-green-600"
            : "text-red-400"
        }`}
      >
        {blog.selectionStatus == "selected" ? "Selected" : "Not Selected"}
      </p>
    <p className="text-sm text-gray-600 mb-4">
  Posted by:{" "}
  {blog.postAsAnonymous ? (
    <span className="inline-flex items-center gap-1">
      Anonymous
      <img
        src="/anonymous.png"
        alt="anonymous"
        className="h-4 w-4 inline-block"
      />
    </span>
  ) : (
    blog.user.name
  )}
  , {blog.user.branch} {blog.user.batch}
</p>
      {!blog.postAsAnonymous && (
        <div className="mt-6">
          <button
            onClick={() => setShowContact(!showContact)}
            className="text-blue-500 cursor-pointer border border-gray-400 rounded px-3 py-1 transition duration-200 hover:bg-gray-100 hover:border-gray-600 flex items-center gap-2"
          >
            Contact writer
            <img src="/nextPage.png" alt="Next" className="h-3 w-3" />
          </button>

          {showContact && (
            <div className="mt-2 p-3 bg-gray-100 rounded text-sm text-gray-800 space-y-1">
              {blog.user.email && (
                <p>
                  <strong>Email:</strong> {blog.user.email}
                </p>
              )}

              {blog.user.linkedin && (
                <p>
                  <strong>LinkedIn:</strong>{" "}
                  <a
                    href={blog.user.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {blog.user.linkedin}
                  </a>
                </p>
              )}
            </div>
          )}
        </div>
      )}
      <hr className="my-4 border-t border-gray-300" />

     {/* Optional Details Section */}
<div className="space-y-1 text-sm text-gray-700 mb-4">
  {blog.arrivedInSem && (
    <p>
      Arrived in Semester: <span className="text-gray-700 font-medium">{blog.arrivedInSem}</span>
    </p>
  )}
  {blog.cgpaCriteria && (
    <p>
      CGPA Criteria: <span className="text-gray-700 font-medium">{blog.cgpaCriteria}</span>
    </p>
  )}
  {blog.packageIntern && (
    <p>
      Intern Package: <span className="text-gray-700 font-medium">₹{blog.packageIntern.toLocaleString("en-IN")}/month</span>
    </p>
  )}
  {blog.packageFullTime && (
    <p>
      Full-Time Package:{" "}
      <span className="text-gray-700 font-medium">
        {(blog.packageFullTime / 100000).toFixed(1)} LPA
      </span>
    </p>
  )}
</div>

      <br />

      <h3 className="text-gray-800 text-2xl">Experience :</h3>
         <br />
      <p className="text-gray-800 font-light whitespace-pre-wrap">{blog.experience}</p>
      <hr className="my-6 border-t border-gray-300" />

<div className="flex items-center gap-1">
  {/* <span className="font-thin text-gray-700">Upvote</span> */}
  <img
    src={upvoted ? upvotedIcon : upvoteIcon}
    alt="Upvote"
    className="h-4 w-4 cursor-pointer"
    onClick={handleUpvote}
  />
  <span className="font-light text-gray-700">{upvotes} </span>
</div>
    </div>
  );
}
