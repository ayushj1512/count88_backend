const express = require("express");
const router = express.Router();

const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogsController");

// GET all blogs
router.get("/", getAllBlogs);

// GET single blog by ID
router.get("/:id", getBlogById);

// POST new blog
router.post("/", createBlog);

// PUT update blog by ID
router.put("/:id", updateBlog);

// DELETE blog by ID
router.delete("/:id", deleteBlog);

module.exports = router;
