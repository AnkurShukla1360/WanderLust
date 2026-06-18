const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const { isLoggedIn, isOwner } = require("../middleware.js");

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
router.post("/", isLoggedIn, async (req, res) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
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
router.put("/:id", isLoggedIn, isOwner, async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
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