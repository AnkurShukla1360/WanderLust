// dotenv wali line hata di hai taaki koi confusion na ho
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// --- DEBUGGING LOGS ---
console.log("===============================");
console.log("CLOUD_NAME:", process.env.CLOUD_NAME ? "Mil gaya ✅" : "Missing ❌");
console.log("CLOUD_API_KEY:", process.env.CLOUD_API_KEY ? "Mil gaya ✅" : "Missing ❌");
console.log("CLOUD_API_SECRET:", process.env.CLOUD_API_SECRET ? "Mil gaya ✅" : "Missing ❌");
console.log("===============================");
// ----------------------

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Wanderlust',
        allowedFormats: ['png', 'jpg', 'jpeg'],
    },
});

module.exports = { cloudinary, storage };