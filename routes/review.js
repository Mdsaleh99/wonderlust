const express = require("express");
const router = express.Router({mergeParams: true}); // https://expressjs.com/en/4x/api.html#express.router // mergeParams: Preserve the req.params values from the parent router. If the parent and the child have conflicting param names, the child’s value take precedence. it means if we have same param name in parent and child then child's value will take precedence
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/review.js")







// Reviews
// post review route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview))


// delete review route
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destoryReview))


module.exports = router