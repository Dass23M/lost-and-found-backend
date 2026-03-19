const User = require("../models/User");
const Notification = require("../models/Notification");
const Item = require("../models/Item");
const bcrypt = require("bcryptjs");

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PATCH /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (email) user.email = email;

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my posted items
// @route   GET /api/users/my-items
// @access  Private
const getMyItems = async (req, res, next) => {
  try {
    const items = await Item.find({ postedBy: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my notifications
// @route   GET /api/users/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .populate("relatedItem", "title type")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PATCH /api/users/notifications/:id/read
// @access  Private
const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/users/notifications/read-all
// @access  Private
const markAllNotificationsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users/admin/users
// @access  Private (admin)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all items (admin only)
// @route   GET /api/users/admin/items
// @access  Private (admin)
const getAllItemsAdmin = async (req, res, next) => {
  try {
    const items = await Item.find()
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

// @desc    Delete any item (admin only)
// @route   DELETE /api/users/admin/items/:id
// @access  Private (admin)
const deleteItemAdmin = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
    await item.deleteOne();
    res.status(200).json({
      success: true,
      message: "Item deleted by admin",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete any user (admin only)
// @route   DELETE /api/users/admin/users/:id
// @access  Private (admin)
const deleteUserAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete an admin user",
      });
    }
    await user.deleteOne();
    res.status(200).json({
      success: true,
      message: "User deleted by admin",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getProfile,
  updateProfile,
  getMyItems,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getAllUsers,
  getAllItemsAdmin,
  deleteItemAdmin,
  deleteUserAdmin,
};