const Product = require('../models/productModel');
const cloudinary = require('../utils/cloudinary'); // ✅ use configured cloudinary

// Slug generator
const generateSlug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

// Upload a single image to Cloudinary using buffer
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'products' },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(buffer); // multer buffer direct pass
  });
};

// Upload multiple images
const uploadImages = async (files) => {
  const uploads = files.map((file) => uploadToCloudinary(file.buffer));
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
      gender,
      price,
      discountPrice,
      variants,
      tags,
      isActive,
    } = req.body;

    if (!groupId || !name || !brand || !category || !variants || !gender || !price) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Parse variants (only size allowed)
    let parsedVariants;
    try {
      parsedVariants = JSON.parse(variants);
      if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) {
        return res.status(400).json({ error: 'Variants must be a non-empty array.' });
      }
      for (const v of parsedVariants) {
        if (!v.size) {
          return res.status(400).json({ error: 'Each variant must have a size.' });
        }
      }
    } catch {
      return res.status(400).json({ error: 'Invalid variants format. Must be JSON.' });
    }

    // Parse tags
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch {
        return res.status(400).json({ error: 'Invalid tags format. Must be JSON.' });
      }
    }

    // Images required
    const files = req.files || [];
    if (!files.length) {
      return res.status(400).json({ error: 'At least one image is required.' });
    }

    // Upload images
    const results = await uploadImages(files);
    const images = results.map((r) => ({
      url: r.secure_url,
      public_id: r.public_id,
    }));

    // Unique slug
    const slug = generateSlug(name);
    const existing = await Product.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        error: 'Product with similar name already exists. Choose a unique name.',
      });
    }

    const product = new Product({
      groupId,
      name,
      slug,
      description,
      brand,
      category,
      subcategory,
      gender,
      price,
      discountPrice,
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
      gender,
      price,
      discountPrice,
      variants,
      tags,
      isActive,
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Replace images if new ones uploaded
    if (req.files && req.files.length > 0) {
      for (let img of product.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
      const results = await uploadImages(req.files);
      product.images = results.map((r) => ({
        url: r.secure_url,
        public_id: r.public_id,
      }));
    }

    if (groupId !== undefined) product.groupId = groupId;
    if (name !== undefined) {
      product.name = name;
      product.slug = generateSlug(name);
    }
    if (description !== undefined) product.description = description;
    if (brand !== undefined) product.brand = brand;
    if (category !== undefined) product.category = category;
    if (subcategory !== undefined) product.subcategory = subcategory;
    if (gender !== undefined) product.gender = gender;
    if (price !== undefined) product.price = price;
    if (discountPrice !== undefined) product.discountPrice = discountPrice;

    if (variants !== undefined) {
      try {
        const parsedVariants = JSON.parse(variants);
        if (!Array.isArray(parsedVariants) || parsedVariants.length === 0) {
          return res.status(400).json({ error: 'Variants must be a non-empty array.' });
        }
        for (const v of parsedVariants) {
          if (!v.size) {
            return res.status(400).json({ error: 'Each variant must have a size.' });
          }
        }
        product.variants = parsedVariants;
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

// @desc Get product by slug
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
