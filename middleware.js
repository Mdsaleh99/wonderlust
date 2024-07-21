const Listing = require("./models/listing.js")
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) =>  {
  // console.log(req.user); // yah req k andar by default user ki information store hoti hai. aur yahi user related information isAuthenticated() ko trigger karti hai ki user authenticate hai ya nhi

  // console.log(req.path, "....", req.originalUrl); // req object andar bahut saari information stored hoti hai aur iske andar ek path and originalUrl name ka key hai
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // req object andar bahut saari information stored hoti hai aur iske andar ek session name ka key hai aur redirectUrl hai o userdefined variable hai
    
    req.flash("error", "You must Logged in to create new listing");
    return res.redirect("/login"); // yahi se return ho ja aayega
  }
  next();
}


module.exports.saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next()
}


module.exports.isOwner = async(req, res, next) => {
  let {id} = req.params

  let listing = await Listing.findById(id)
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error", "You are not owner of this listing")
    return res.redirect(`/listings/${id}`);
  }
  next()
}

// validation schema middleware
module.exports.validateListing = (req, res, next) => {
  // joi is The most powerful schema description language and data validator for JavaScript.
  // https://www.npmjs.com/package/joi?activeTab=readme

  let {error} = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",") // details is a property of error object 
    throw new ExpressError(400, errMsg);
  }else{
    next()
  }
}


module.exports.validateReview = (req, res, next) => {
  // joi is The most powerful schema description language and data validator for JavaScript.
  // https://www.npmjs.com/package/joi?activeTab=readme

  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(","); // details is a property of error object
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;

  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};