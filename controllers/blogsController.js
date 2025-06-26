const Blog = require("../models/Blogs.js");

// @desc    Get all blogs
// @route   GET /api/blogs
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch blogs", error: err.message });
    }
};

// @desc    Get a single blog by ID
// @route   GET /api/blogs/:id
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: "Error fetching blog", error: err.message });
    }
};

// @desc    Create a new blog
// @route   POST /api/blogs
exports.createBlog = async (req, res) => {
    try {
        const { title, description, link, tags, label } = req.body;

        const newBlog = new Blog({
            title,
            description,
            link,
            tags,
            label,
        });

        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (err) {
        res.status(400).json({ message: "Failed to create blog", error: err.message });
    }
};

// @desc    Update a blog
// @route   PUT /api/blogs/:id
exports.updateBlog = async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updatedBlog) return res.status(404).json({ message: "Blog not found" });
        res.json(updatedBlog);
    } catch (err) {
        res.status(400).json({ message: "Failed to update blog", error: err.message });
    }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
exports.deleteBlog = async (req, res) => {
    try {
        const deleted = await Blog.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Blog not found" });
        res.json({ message: "Blog deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete blog", error: err.message });
    }
};
