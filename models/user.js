const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

// 👇 SMART FIX: Node.js v22 Import Error Fix
if (typeof passportLocalMongoose === 'function') {
    // Normal import
    userSchema.plugin(passportLocalMongoose);
} else if (passportLocalMongoose.default) {
    // Nested default import (For newer Node versions)
    userSchema.plugin(passportLocalMongoose.default);
} else {
    console.error("🚨 Error loading passport-local-mongoose");
}

module.exports = mongoose.model("User", userSchema);