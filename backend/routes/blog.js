// routes/blog.js
//order:
//fetch by filters,fetch single blog by id,add,delete,upvote,update

const express = require("express");
const Blog = require("../models/blog");
const User = require("../models/user");
const protect = require("../middleware/authMiddleware");
const Company = require('../models/company');
const mongoose = require("mongoose");

const router = express.Router();

// GET /blogs/filter
router.get("/filter", async (req, res) => {
  try {
    const {
      companyName,
      campusType,
      arrivedInSem,
      cgpaCriteria,
      selectionStatus,
      packageMin,
      
    } = req.query;

    const filter = {};
    const orConditions = [];


    if (companyName) filter.companyName = companyName;
    if (campusType) filter.campusType = campusType;
    if (arrivedInSem) filter.arrivedInSem = Number(arrivedInSem);
    if (selectionStatus) filter.selectionStatus = selectionStatus;

    //cgpa <=x or null , null too as many times it isnt known.
    if (cgpaCriteria) {
      filter.$or = [
          {cgpaCriteria: {$lte: Number(cgpaCriteria)}},
          {cgpaCriteria: null}
      ];
    }
   

    // Full time Package Range Filtering
    //intern package not considered here.
   

    if (packageMin) {
      filter.packageFullTime = {
        $gte: Number(packageMin)
      };
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    // console.log("Incoming Query:", req.query);
    // console.log("Constructed Filter:", filter);



    const blogs = await Blog.find(filter)
      .sort({ 
        createdAt: -1

       }) 
      .skip(skip)
      .limit(parseInt(limit))
      .populate("user", "-password -__v");
    //every blog is populated with all users details who wrote it
   
    const total = await Blog.countDocuments(filter);
  
  
    const blogsWithUpvotes = blogs.map((blog)=>{
          return{
            ...blog.toObject(),//mongoose doc to object
            upvotes: blog.upvotes.length,
            //returning just the count of upvotes rather than
            //full array to homepage, only count is required there
            
          }
    })



    res.status(200).json({
      message: "Filtered blogs fetched successfully",
      currentPage: parseInt(page),
      totalPages: Math.max(1, Math.ceil(total / limit)),
      totalBlogs: total,
      blogs: blogsWithUpvotes,
    });
  } catch (error) {
    console.error("Filter Fetch Error:", error.message, error.stack);
    res.status(500).json({ message: "Server error while fetching blogs" });
  }
});

//................................................................

// POST /blog/add
router.post("/add", protect, async (req, res) => {
  const {
    postAsAnonymous,
    companyName,
    campusType,
    arrivedInSem,
    cgpaCriteria,
    packageIntern,
    packageFullTime,
    selectionStatus,
    experience,
    //this is destructuring , name must be exact saem as that in re.body
    //order can vary,this  copies values as it is in these variable
  } = req.body;
   //we add a blog and increase the count in compnay model for that company.
   //and decrease the count when a blog gets deleted
   //so that when blog is deleted, if no blog left for that compnay we remove it from company model
  try {

    function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const formattedCompanyName = toTitleCase(companyName.trim());

    // Check if company already exists
    let existingCompany = await Company.findOne({ name: formattedCompanyName });
  
    // If not, add new company to DB
    if (!existingCompany) {
      existingCompany = new Company({ name: formattedCompanyName });
      await existingCompany.save();
    }

    const blog = new Blog({
      user: req.user._id,
      postAsAnonymous,
      companyName: formattedCompanyName,
      campusType,
      arrivedInSem,
      cgpaCriteria,
      packageIntern,
      packageFullTime,
      selectionStatus,
      experience,
    });
// console.log('a');

    await blog.save();
    // console.log('b');

    // Increment blogsWritten for the user
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { blogsWritten: 1 },
    });

    await Company.findOneAndUpdate(
  { name: formattedCompanyName },
  { $inc: { blogCount: 1 } }
);

    res
      .status(201)
      .json({ message: "Blog posted successfully", blogId: blog._id });
  } catch (error) {
    console.error("Blog Post Error:", error);
    res.status(500).json({ message: "Server error while posting blog" });
  }
});

// DELETE /api/blog/admin-delete
router.delete("/admin-delete", async (req, res) => {
  const { blogId, adminKey } = req.body;
  const serverKey = process.env.DELETE_BLOG_KEY;

  if (!adminKey || adminKey !== serverKey) {
    return res.status(403).json({ message: "Forbidden: Invalid admin key" });
  }

  try {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const company = blog.companyName;
    const userId = blog.user;

    await blog.deleteOne();

    //  Decrease blog count in Company
    const updatedCompany = await Company.findOneAndUpdate(
      { name: company },
      { $inc: { blogCount: -1 } },
      { new: true }
    );

    //  Remove company if no blogs remain
    if (updatedCompany && updatedCompany.blogCount <= 0) {
      await Company.findOneAndDelete({ name: company });
    }

    // Decrease blogsWritten for the user
    await User.findByIdAndUpdate(userId, {
      $inc: { blogsWritten: -1 },
    });

    res.status(200).json({ message: "Blog deleted by admin" });
  } catch (error) {
    console.error("❌ Admin Delete Error:", error);
    res.status(500).json({ message: "Server error while deleting blog" });
  }
});
//........................................................

// DELETE /blog/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    

    if (blog.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this blog" });
    }

    //How is blog.user (which is an entire User object in DB) equal to
    //req.user._id (which is just the user’s ID)?

    //Ans: Mongoose magic — blog.user is not a full user object unless you explicitly .populate() it
    //Without populate() blog.user is just the object_id of the user.
    const company = blog.companyName;

    await blog.deleteOne();

    //Removing the company from DB if no blog left for it

    const updatedCompany = await Company.findOneAndUpdate(
      {name : company},
      {$inc: {blogCount : -1}},
      {new : true}// returns the updated document and not the old one
    );
    if(updatedCompany && updatedCompany.blogCount<=0){
      await Company.findOneAndDelete({ name: company });
    }

    

    //  decrement blogsWritten count for the user.
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { blogsWritten: -1 },
    });



    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete Blog Error:", error);
    res.status(500).json({ message: "Server error while deleting blog" });
  }
});

//......................................................

// POST /blog/:id/upvote
// POST /api/blog/<blog_id>/upvote


router.post("/:id/upvote", protect, async (req, res) => {
  try {
   

    const blogId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
     
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
  
      return res.status(404).json({ message: "Blog not found" });
    }

    const alreadyUpvoted = blog.upvotes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyUpvoted) {
      blog.upvotes.pull(userId);
      
    } else {
      blog.upvotes.push(userId);
   
    }

    await blog.save();
   

    res.status(200).json({
      message: alreadyUpvoted ? "Upvote removed" : "Upvoted successfully",
      totalUpvotes: blog.upvotes.length,
      userHasUpvoted: !alreadyUpvoted,
    });
  } catch (error) {
    console.error("❌ Upvote Error:", error.message);
    res.status(500).json({ message: "Server error while toggling upvote" });
  }
});

//..................................................
//Edit Blog
// PUT /api/blog/:id
//can do delete previous blog and create new with updated changes
//but will loose upvote count
//therefoore using put is better
//see notion notes must for this

router.put("/:id", protect, async (req, res) => {
  try {
    const blogId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ message: "Invalid blog ID" });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (blog.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this blog" });
    }

    const allowedFields = [
      "postAsAnonymous",
      "companyName",
      "campusType",
      "arrivedInSem",
      "cgpaCriteria",
      "packageIntern",
      "packageFullTime",
      "selectionStatus",
      "experience",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        blog[field] = req.body[field];
      }
    });

    await blog.save();

    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    console.error("Update Blog Error:", error);
    res.status(500).json({ message: "Server error while updating blog" });
  }
});

// api/blog/mine by user id for profile page 
router.get("/mine",protect, async (req, res) => {
 
  try {


    const userId = req.user._id;
   

    const blogs = await Blog.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Blogs by user fetched successfully",
      blogs,
    });
  } catch (error) {
    console.error("❌ Fetch User Blogs Error:", error.message);
    console.error(error.stack); 
    res.status(500).json({ message: "Server error while fetching user blogs" });
  }
});

//..............................................................

//GET /blog/:id
//getting a single blog by id
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('user','-password -__v');

    //without .populate b v=bog data aajaega pr usme bs user id hi rhegi
    //to get complete user data too in response, we use 'populate user'
    // -__v is the field auto added by mongoose to trach the version of the document
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    // console.log(Blog);
    res.status(200).json({ message: "Blog fetched successfully", blog });
  } catch (err) {
    res.status(500).json({message: 'Server Error while fetching blog'});
  }
});


//............................................................








module.exports = router;
