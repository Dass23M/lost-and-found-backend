const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  resolveItem,
} = require("../controllers/item.controller");
const { protect } = require("../middleware/auth.middleware");

const upload = multer({ dest: "uploads/" });

router.get("/", getItems);
router.get("/:id", getItemById);
router.post("/", protect, upload.array("images", 5), createItem);
router.patch("/:id", protect, updateItem);
router.delete("/:id", protect, deleteItem);
router.patch("/:id/resolve", protect, resolveItem);

module.exports = router;