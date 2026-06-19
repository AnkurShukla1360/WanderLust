const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
});

// Fix for Render/Mongoose Plugin Error
const plugin = passportLocalMongoose.default || passportLocalMongoose;
userSchema.plugin(plugin);

module.exports = mongoose.model("User", userSchema);