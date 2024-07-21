const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
  let { id } = req.params; // this id is coming from url /listings/:id from this id we getting all the data of that id from db and showing in show.ejs file
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exist!");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListings = async (req, res, next) => {
  // let {title, description, image, price, country, location} = req.body;  // instead of doing like this we can write like this
  // writing this schema validator is very tedious task to overcome this we use joi
  // if (!req.body.listing) {
  //   throw new ExpressError(400, "Send valid data for listing");
  // }

  // joi is The most powerful schema description language and data validator for JavaScript.
  // https://www.npmjs.com/package/joi?activeTab=readme

  // see above validate listing middleware

  let listing = req.body.listing; // this req.body.listing  here listing comming from new.ejs in input field in name.   e.g: name="listing[title]"

  let url = req.file.path;
  let filename = req.file.filename;

  // ye url, fileName sab req.file se arra hai jo ->{"fieldname":"listing[image][url]","originalname":"Screenshot 2024-06-22 212705.png","encoding":"7bit","mimetype":"image/png","path":"https://res.cloudinary.com/dt8vs0h5y/image/upload/v1721218816/wonderlust_DEV/vh4svtcxzkz33jpuavvq.png","size":21596,"filename":"wonderlust_DEV/vh4svtcxzkz33jpuavvq"}

  let newListing = new Listing({
    title: listing.title,
    description: listing.description,
    price: listing.price,
    country: listing.country,
    location: listing.location,
    // image: { url: listing.image.url },
  });
  //   console.log(newListing);
  newListing.image = {url, filename: filename}

  // if (!newListing.title) {
  //   // writing this schema validator is very tedious task to overcome this we use joi
  //   throw new ExpressError(400, "Title is missing");
  // }

  // if (!newListing.description) {
  //   throw new ExpressError(400, "Description is missing");
  // }
  newListing.owner = req.user._id; // req object k andar passport by default user related information store karwa ta hai tho hum uss user ki id k basis pe uss listing ka owner bana k store karenge
  await newListing.save();
  req.flash("success", "Successfully created new listing");
  res.redirect("/listings");
};
// create route
/** 
router.post("/listings", async (req, res) => {
  // let {title, description, image, price, country, location} = req.body;  // instead of doing like this we can write like this
  let listing = req.body.listing // this req.body.listing  here listing comming from new.ejs in input field in name.   e.g: name="listing[title]"
  // console.log(listing);
  let newListing = new Listing(listing) // creating new list
  await newListing.save()
  res.redirect("/listings")
})
**/


module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params; // this id is coming from url /listings/:id from this id we getting all the data of that id from db
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exist!");
    res.redirect("/listings");
  }

  // https://cloudinary.com/documentation/image_transformations
  let originalImageUrl = listing.image.url
  originalImageUrl = originalImageUrl.replace(
    "/upload",
    "/upload/w_250"
  );

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};


module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // req.body.listing is javascript object which is coming from edit.ejs file and jis ke andar title, image, description, price, location, country hai aur isko destructuring karke un parameters ko individual values me convert karke new updated values ko pass kar rahe hai {...req.body.listing}

  if(typeof req.file !== "undefined"){ // edit page me agr image change nhi kiya to error aayega matlab url aur filename empty aayenge usse bachne k liye ye condition dala hai
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename: filename };
    await listing.save();
  }

  req.flash("success", "Listing updated");
  res.redirect(`/listings/${id}`);
};


module.exports.destoryListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  // console.log(deletedListing);
  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};