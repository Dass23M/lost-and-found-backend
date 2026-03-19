const Claim = require("../models/Claim");
const Item = require("../models/Item");
const Notification = require("../models/Notification");
const sendEmail = require("../config/email");

// @desc    Submit a claim on an item
// @route   POST /api/claims
// @access  Private
const submitClaim = async (req, res, next) => {
  try {
    const { itemId, description } = req.body;

    if (!itemId || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide itemId and description",
      });
    }

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (item.status === "resolved") {
      return res.status(400).json({
        success: false,
        message: "This item is already resolved",
      });
    }

    if (item.postedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot claim your own item",
      });
    }

    const existingClaim = await Claim.findOne({
      item: itemId,
      claimant: req.user._id,
    });

    if (existingClaim) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a claim for this item",
      });
    }

    const claim = await Claim.create({
      item: itemId,
      claimant: req.user._id,
      description,
    });

    await Notification.create({
      user: item.postedBy,
      message: `Someone submitted a claim on your item: "${item.title}"`,
      relatedItem: item._id,
    });

    res.status(201).json({
      success: true,
      message: "Claim submitted successfully",
      data: claim,
    });

    const itemOwner = await require("../models/User").findById(item.postedBy);
    if (itemOwner) {
      await sendEmail({
        to: itemOwner.email,
        subject: `New claim on your item: "${item.title}"`,
        text: `Hi ${itemOwner.name},\n\nSomeone has submitted a claim on your item "${item.title}".\n\nLogin to review and approve or reject the claim.\n\nLost & Found`,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all claims on a specific item
// @route   GET /api/claims/item/:itemId
// @access  Private (owner only)
const getClaimsByItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (item.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view claims on this item",
      });
    }

    const claims = await Claim.find({ item: req.params.itemId })
      .populate("claimant", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: claims.length,
      data: claims,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all claims submitted by logged in user
// @route   GET /api/claims/my-claims
// @access  Private
const getMyClaims = async (req, res, next) => {
  try {
    const claims = await Claim.find({ claimant: req.user._id })
      .populate("item", "title type location status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: claims.length,
      data: claims,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a claim
// @route   PATCH /api/claims/:id/approve
// @access  Private (item owner only)
const approveClaim = async (req, res, next) => {
  try {
    const claim = await Claim.findById(req.params.id).populate("item");

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    if (claim.item.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to approve this claim",
      });
    }

    claim.status = "approved";
    await claim.save();

    await Item.findByIdAndUpdate(claim.item._id, { status: "resolved" });

    await Notification.create({
      user: claim.claimant,
      message: `Your claim on "${claim.item.title}" has been approved!`,
      relatedItem: claim.item._id,
    });

    res.status(200).json({
      success: true,
      message: "Claim approved and item marked as resolved",
      data: claim,
    });

    const claimant = await require("../models/User").findById(claim.claimant);
    if (claimant) {
      await sendEmail({
        to: claimant.email,
        subject: `Your claim has been approved!`,
        text: `Hi ${claimant.name},\n\nYour claim on "${claim.item.title}" has been approved.\n\nPlease contact the owner to arrange the return.\n\nLost & Found`,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a claim
// @route   PATCH /api/claims/:id/reject
// @access  Private (item owner only)
const rejectClaim = async (req, res, next) => {
  try {
    const claim = await Claim.findById(req.params.id).populate("item");

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    if (claim.item.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to reject this claim",
      });
    }

    claim.status = "rejected";
    await claim.save();

    await Notification.create({
      user: claim.claimant,
      message: `Your claim on "${claim.item.title}" has been rejected.`,
      relatedItem: claim.item._id,
    });

    res.status(200).json({
      success: true,
      message: "Claim rejected",
      data: claim,
    });

    const claimant = await require("../models/User").findById(claim.claimant);
    if (claimant) {
      await sendEmail({
        to: claimant.email,
        subject: `Your claim has been rejected`,
        text: `Hi ${claimant.name},\n\nUnfortunately your claim on "${claim.item.title}" has been rejected.\n\nLost & Found`,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitClaim,
  getClaimsByItem,
  getMyClaims,
  approveClaim,
  rejectClaim,
};
