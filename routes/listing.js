const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const { isLoggedIn, isOwner } = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js"); // Ensure correct path
const upload = multer({ storage });

// Index Route
router.get("/", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

// New Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

// Show Route
router.get("/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({path: "reviews", populate: {path: "author"}})
        .populate("owner");
    res.render("listings/show.ejs", { listing });
});

// Create Route
// router.post("/", isLoggedIn, async (req, res) => {
//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;
//     await newListing.save();
//     req.flash("success", "New Listing Created!");
//     res.redirect("/listings");
// });

router.post("/", isLoggedIn, upload.single("listing[image]"), async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    // Check if file is uploaded via Cloudinary
    if (req.file) {
        newListing.image = { url: req.file.path, filename: req.file.filename };
    } 
    // Otherwise check if URL is pasted
    else if (req.body.listing.imageLink) {
        newListing.image = { url: req.body.listing.imageLink, filename: "listing-image" };
    }

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
});

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

// Update Route
// router.put("/:id", isLoggedIn, isOwner, async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     req.flash("success", "Listing Updated!");
//     res.redirect(`/listings/${id}`);
// });
router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    // Check if new file is uploaded
    if (typeof req.file !== "undefined") {
        listing.image = { url: req.file.path, filename: req.file.filename };
        await listing.save();
    } 
    // Otherwise check if new text URL is provided
    else if (req.body.listing.imageLink) {
        listing.image = { url: req.body.listing.imageLink, filename: "listing-image" };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
});

// Delete Route
router.delete("/:id", isLoggedIn, isOwner, async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

module.exports = router;