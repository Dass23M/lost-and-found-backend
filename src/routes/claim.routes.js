const express = require("express");
const router = express.Router();
const {
  submitClaim,
  getClaimsByItem,
  getMyClaims,
  approveClaim,
  rejectClaim,
} = require("../controllers/claim.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/", protect, submitClaim);
router.get("/my-claims", protect, getMyClaims);
router.get("/item/:itemId", protect, getClaimsByItem);
router.patch("/:id/approve", protect, approveClaim);
router.patch("/:id/reject", protect, rejectClaim);

module.exports = router;
