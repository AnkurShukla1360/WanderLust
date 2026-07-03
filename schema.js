// const Joi = require("joi");

// module.exports.listingSchema = Joi.object({
//     listing: Joi.object({
//         title: Joi.string().required(),
//         description: Joi.string().required(),
//         location: Joi.string().required(),
//         country: Joi.string().required(),
//         price: Joi.number().required().min(0),
//         image: Joi.object({
//             url: Joi.string().allow("", null).required()
//         }).required()
//     }).required(),
// });

// module.exports.reviewSchema = Joi.object({
//     review: Joi.object({
//         rating: Joi.number().required().min(1).max(5),
//         comment: Joi.string().trim().required(),
//     }).required(),
// });


const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        
        // image ko ab optional kar diya hai kyunki Multer isko req.file me handle karta hai
        image: Joi.string().allow("", null), 
        
        // Ye naya field hai jo humne form (new.ejs aur edit.ejs) me paste URL ke liye banaya hai
        imageLink: Joi.string().allow("", null) 
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().trim().required(),
    }).required(),
});