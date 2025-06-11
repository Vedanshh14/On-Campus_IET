// routes/blog.js
//add,delete


const express = require('express');
const Blog = require('../models/blog');
const User = require('../models/user');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

//GET /blog/all
//returns all blogs in DB

// POST /blog/add
router.post('/add', protect, async (req, res) => {
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

  try {
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

    res.status(201).json({ message: 'Blog posted successfully', blogId: blog._id });
  } catch (error) {
    console.error('Blog Post Error:', error);
    res.status(500).json({ message: 'Server error while posting blog' });
  }
});

// DELETE /blog/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }

    //How is blog.user (which is an entire User object in DB) equal to
    //req.user._id (which is just the user’s ID)?

    //Ans: Mongoose magic — blog.user is not a full user object unless you explicitly .populate() it
    //Without populate() blog.user is just the object_id of the user.

    await blog.deleteOne();

    // Optionally decrement blogsWritten count
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { blogsWritten: -1 }
    });

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete Blog Error:', error);
    res.status(500).json({ message: 'Server error while deleting blog' });
  }
});

module.exports = router;