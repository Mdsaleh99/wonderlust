const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");


// https://www.npmjs.com/package/cloudinary
// https://cloudinary.com/documentation/node_quickstart
// https://www.npmjs.com/package/multer-storage-cloudinary


//console.cloudinary.com/pm/c-70272d131725d323af48bfea5c96bc/getting-started
https: cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "wonderlust_DEV",
    allowedFormats: ["png", "jpeg", "jpg"], 
  },
});


module.exports = {
    cloudinary,
    storage
}