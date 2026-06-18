const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// EJS Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

// Root Route
app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

// Index Route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    console.log(allListings);
    res.send(allListings);
});

// Show Route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.send(listing);
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});