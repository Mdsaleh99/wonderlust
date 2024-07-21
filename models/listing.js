const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");


const listingSchema = new Schema({
  title: {
    type: String,
  },
  description: String,
  image: {
    filename: String,
    url: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

listingSchema.post("findOneAndDelete", async(listing) => {
  // https://mongoosejs.com/docs/middleware.html#post
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
})


// https://mongoosejs.com/docs/middleware.html#pre

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;


















// // https://mongoosejs.com/docs/guide.html#virtuals
// const listingSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//   },
//   price: {
//     type: Number,
//   },
//   location: {
//     type: String,
//   },
//   image: {
//     type: String,
//     filename: String,
//     url: String,
//     set: (v) =>
//       v === ""
//         ? "https://img.freepik.com/free-photo/type-entertainment-complex-popular-resort-with-pools-water-parks-turkey-with-more-than-5-million-visitors-year-amara-dolce-vita-luxury-hotel-resort-tekirova-kemer_146671-18728.jpg?w=1060&t=st=1715667282~exp=1715667882~hmac=4551f27af2f0664418d7520d20156096bff64321151ebf1f42be2f818a03648a"
//         : v, // set is a function that is called when the value is set on the field (image in this case) v is image url here
//     default:
//       "https://img.freepik.com/free-photo/type-entertainment-complex-popular-resort-with-pools-water-parks-turkey-with-more-than-5-million-visitors-year-amara-dolce-vita-luxury-hotel-resort-tekirova-kemer_146671-18728.jpg?w=1060&t=st=1715667282~exp=1715667882~hmac=4551f27af2f0664418d7520d20156096bff64321151ebf1f42be2f818a03648a",
//   },
//   country: String,
// });
