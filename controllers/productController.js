const Product = require('../models/productModel');
const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');

// Slug generator
const generateSlug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

// Upload a single image to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'products' },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Upload multiple images
const uploadImages = async (files) => {
  const uploads = files.map(file => uploadToCloudinary(file.buffer));
  return await Promise.all(uploads);
};

// @desc Create a new product
const createProduct = async (req, res) => {
  try {
    const {
      groupId,
      name,
      description,
      brand,
      category,
      subcategory,
      variants,
      tags,
      isActive
    } = req.body;

    if (!groupId || !name || !brand || !category || !variants) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    let parsedVariants;
    try {
      parsedVariants = JSON.parse(variants);
    } catch {
      return res.status(400).json({ error: 'Invalid variants format. Must be JSON.' });
    }

    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch {
        return res.status(400).json({ error: 'Invalid tags format. Must be JSON.' });
      }
    }

    const files = req.files || [];
    if (!files.length) {
      return res.status(400).json({ error: 'At least one image is required.' });
    }

    const results = await uploadImages(files);
    const images = results.map(r => ({
      url: r.secure_url,
      public_id: r.public_id,
    }));

    const slug = generateSlug(name);
    const existing = await Product.findOne({ slug });
    if (existing) {
      return res.status(400).json({ error: 'Product with similar name already exists. Choose a unique name.' });
    }

    const product = new Product({
      groupId,
      name,
      slug,
      description,
      brand,
      category,
      subcategory,
      variants: parsedVariants,
      tags: parsedTags,
      images,
      isActive: isActive !== undefined ? isActive : true,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Update product details
const updateProduct = async (req, res) => {
  try {
    const {
      groupId,
      name,
      description,
      brand,
      category,
      subcategory,
      variants,
      tags,
      isActive
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Handle image replacement
    if (req.files && req.files.length > 0) {
      for (let img of product.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }

      const results = await uploadImages(req.files);
      product.images = results.map(r => ({
        url: r.secure_url,
        public_id: r.public_id,
      }));
    }

    if (groupId !== undefined) product.groupId = groupId;
    if (name !== undefined) {
      product.name = name;
      product.slug = generateSlug(name); // Regenerate slug if name changes
    }
    if (description !== undefined) product.description = description;
    if (brand !== undefined) product.brand = brand;
    if (category !== undefined) product.category = category;
    if (subcategory !== undefined) product.subcategory = subcategory;

    if (variants !== undefined) {
      try {
        product.variants = JSON.parse(variants);
      } catch {
        return res.status(400).json({ error: 'Invalid variants format. Must be JSON.' });
      }
    }

    if (tags !== undefined) {
      try {
        product.tags = JSON.parse(tags);
      } catch {
        return res.status(400).json({ error: 'Invalid tags format. Must be JSON.' });
      }
    }

    if (isActive !== undefined) product.isActive = isActive;

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    for (let img of product.images) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductBySlug,
};
