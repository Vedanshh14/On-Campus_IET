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

    if (companyName) filter.companyName = companyName;
    if (campusType) filter.campusType = campusType;
    if (arrivedInSem) filter.arrivedInSem = Number(arrivedInSem);
    if (cgpaCriteria) {
      filter.cgpaCriteria = { $lte: Number(cgpaCriteria) };
    }
    if (selectionStatus) filter.selectionStatus = selectionStatus;

    // Full time Package Range Filtering
    //intern package not considered here.
    //tell user to always enter in LPA .eg 6.25 LPA will also work

    if (packageMin) {
      filter.packageFullTime = {
        $gte: Number(packageMin),
      };
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(parseInt(limit))
      .populate("user", "-password -__v");
    //every blog is populated with all users details who wrote it

    const total = await Blog.countDocuments(filter);

    res.status(200).json({
      message: "Filtered blogs fetched successfully",
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalBlogs: total,
      blogs,
    });
  } catch (error) {
    console.error("Filter Fetch Error:", error);
    res.status(500).json({ message: "Server error while fetching blogs" });
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
    console.log(Blog);
    res.status(200).json({ message: "Blog fetched successfully", blog });
  } catch (err) {
    res.status(500).json({message: 'Server Error while fetching blog'});
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
    // Check if company already exists
    let existingCompany = await Company.findOne({ name: companyName });

    // If not, add new company to DB
    if (!existingCompany) {
      existingCompany = new Company({ name: companyName });
      await existingCompany.save();
    }

    const blog = new Blog({
      user: req.user._id,
      postAsAnonymous,
      companyName,
      campusType,
      arrivedInSem,
      cgpaCriteria,
      packageIntern,
      packageFullTime,
      selectionStatus,
      experience,
    });

    await blog.save();

    // Increment blogsWritten for the user
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { blogsWritten: 1 },
    });

    await Company.findOneAndUpdate(
  { name: companyName },
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

    await blog.deleteOne();

    // Optionally decrement blogsWritten count
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
    const blog = await Blog.findById(req.params.id);
    //while testing i found incorrect blog id sends u to
    //catch block(500) and doesnt return 404 of below line

    if (!blog) return res.status(404).json({ message: "Blog not found" });
    //if u see in blog schema, upvote actualy is an array of userids
    //which stores which user has upvoted a given block.
    const userId = req.user._id;

    const alreadyUpvoted = blog.upvotes.includes(userId);

    if (alreadyUpvoted) {
      blog.upvotes.pull(userId); // remove upvote
    } else {
      blog.upvotes.push(userId); // add upvote
    }

    await blog.save();

    res.status(200).json({
      message: alreadyUpvoted ? "Upvote removed" : "Upvoted successfully",
      totalUpvotes: blog.upvotes.length,
      userHasUpvoted: !alreadyUpvoted,
    });
  } catch (error) {
    console.error("Upvote Error:", error);
    res.status(500).json({ message: "Server error while toggling upvote" });
  }
});

//..................................................
//update route
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

module.exports = router;
