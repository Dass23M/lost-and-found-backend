const Item = require("../models/Item");
const cloudinary = require("../config/cloudinary");

// @desc    Get all items (with search + filter)
// @route   GET /api/items
// @access  Public
const getItems = async (req, res, next) => {
  try {
    const { search, category, type, status, location } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) query.category = category;
    if (type) query.type = type;
    if (status) query.status = status;
    if (location) query.location = { $regex: location, $options: "i" };

    const items = await Item.find(query)
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      "postedBy",
      "name email"
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new item
// @route   POST /api/items
// @access  Private
const createItem = async (req, res, next) => {
  try {
    const { title, description, category, type, location } = req.body;

    if (!title || !description || !category || !type || !location) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    let images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "lost-and-found",
        });
        images.push(result.secure_url);
      }
    }

    const item = await Item.create({
      title,
      description,
      category,
      type,
      location,
      images,
      postedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Item posted successfully",
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item
// @route   PATCH /api/items/:id
// @access  Private (owner only)
const updateItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (item.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this item",
      });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private (owner only)
const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (item.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this item",
      });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark item as resolved
// @route   PATCH /api/items/:id/resolve
// @access  Private (owner only)
const resolveItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (item.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to resolve this item",
      });
    }

    item.status = "resolved";
    await item.save();

    res.status(200).json({
      success: true,
      message: "Item marked as resolved",
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  resolveItem,
};