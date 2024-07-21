if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}

const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js")
const listingController = require("../controllers/listing.js")
const multer = require("multer");
const {storage} = require("../cloudConfig.js")
// const upload = multer({ dest: "uploads/" });
const upload = multer({ storage });




// Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency.
// NOTE: Multer will not process any form which is not multipart (multipart/form-data).
// https://www.npmjs.com/package/multer?activeTab=readme





// https://expressjs.com/en/4x/api.html#router.route
router
  .route("/") // Returns an instance of a single route which you can then use to handle HTTP verbs with optional middleware. Use router.route() to avoid duplicate route naming and thus typing errors.
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,

    upload.single("listing[image][url]"),
    validateListing,
    wrapAsync(listingController.createListings)
  );
  





// New route
router.get("/new", isLoggedIn, listingController.renderNewForm)


router
  .route("/:id")
  .get(wrapAsync(listingController.showListings))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image][url]"),
    validateListing,
    wrapAsync(listingController.updateListing) // update route
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destoryListing));


// edit route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm))






router



module.exports = router; 