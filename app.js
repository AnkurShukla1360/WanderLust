// Dotenv config sabse upar hona zaroori hai
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const multer = require("multer");
const { storage } = require("./cloudConfig");

const upload = multer({ storage });

const User = require("./models/user"); 

// Routers
const listingsRouter = require("./routes/listing");
const userRouter = require("./routes/user");
const reviewsRouter = require("./routes/review"); 

// DB URL
const dburl = process.env.ATLASDB_URL;

if (!dburl) {
    console.error("FATAL ERROR: ATLASDB_URL is not defined! Render dashboard mein env variables check karo.");
    process.exit(1);
}

async function main() {
    await mongoose.connect(dburl);
}

main()
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Mongo Store for sessions
const store = MongoStore.create({
    mongoUrl: dburl,
    touchAfter: 24 * 60 * 60, // 24 hours
    crypto: {
        secret : process.env.SECRET || "backupsecret",
    },
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
});

// Session Options
const sessionOptions = {
    store: store,
    secret: process.env.SECRET || "backupsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash & Current User Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; 
    next();
});

// Routes
app.get("/", (req, res) => {
    res.redirect("/listings"); 
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// 404 Error handler
app.use((req, res, next) => {
    res.status(404).send("Page Not Found!");
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
});