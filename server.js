const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();

// Session Middleware Setup
app.use(
    session({
        secret: "mysupersecretstring",
        resave: false, // Console warnings hatane ke liye
        saveUninitialized: true, // Console warnings hatane ke liye
    })
);
app.use(flash());
// Test Route to check Cookies & Session
app.get("/test", (req, res) => {
    // Agar user pehle se aaya hai, toh uska count badha do
    if (req.session.count) {
        req.session.count++;
    } else {
        // Agar pehli baar aaya hai, toh count 1 set kar do
        req.session.count = 1;
    }
    
    res.send(`Test successful! Aapne is page ko ${req.session.count} baar visit kiya hai.`);
});

// Start Server
app.listen(3000, () => {
    console.log("Server is listening to port 3000");
});