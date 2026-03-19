const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/user.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");

router.get("/profile", protect, getProfile);
router.patch("/profile", protect, updateProfile);
router.get("/my-items", protect, getMyItems);
router.get("/notifications", protect, getNotifications);
router.patch("/notifications/read-all", protect, markAllNotificationsRead);
router.patch("/notifications/:id/read", protect, markNotificationRead);

router.get("/admin/users", protect, adminOnly, getAllUsers);
router.get("/admin/items", protect, adminOnly, getAllItemsAdmin);
router.delete("/admin/items/:id", protect, adminOnly, deleteItemAdmin);
router.delete("/admin/users/:id", protect, adminOnly, deleteUserAdmin);

module.exports = router;