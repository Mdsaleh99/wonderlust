const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")
const MongoStore = require("connect-mongo");

// https://www.npmjs.com/package/connect-mongo

//  study about cookies ->   https://expressjs.com/en/4x/api.html#res.cookie
//                           https://www.npmjs.com/package/cookie-parser -> study more about signed cookie
// intentional changes ko avoid karne k liye signed cookie use karte hai

const app = express();
app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, "/public")))


// https://github.com/auth0/node-jsonwebtoken?tab=readme-ov-file
// https://github.com/CodeWithGionatha-Labs/music-player



const dbUrl = process.env.MONGO_URI

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
})

const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    // https://www.npmjs.com/package/express-session#cookieexpires
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // toadys date + 7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// app.get("/", (req, res) => {
//   res.send("Root is working");
// });




app.use(session(sessionOptions))
app.use(flash())


app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

/**
  authenticate() Generates a function that is used in Passport's LocalStrategy
  
  serializeUser() Generates a function that is used by Passport to serialize users into the session
  
  deserializeUser() Generates a function that is used by Passport to deserialize users into the session

 */


app.use((req, res, next) => {
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  res.locals.currUser = req.user
  // console.log(res.locals.success);
  next()
})

// app.get("/demouser", async(req, res) => {
//   let fakeUser = new User({
//     email: "abc@gmail.com",
//     username: "abc",
//   });

//   let registerUser = await User.register(fakeUser, "helloworld"); // register(user, password, cb) Convenience method to register a new user instance with a given password. Checks if username is unique. See login example.
//   // https://github.com/saintedlama/passport-local-mongoose/tree/main/examples/login
//   // in passport pbkdf2 hashing algorithm use
//   res.send(registerUser);
// })


main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err)
  });

async function main() {
  await mongoose.connect(dbUrl);
}




app.use("/listings", listingsRouter)
app.use("/listings/:id/reviews", reviewsRouter)
app.use("/", userRouter)



// app.get("/test", async (req, res) => {
//   let sampleTest = new Listing({
//     title: "my villa",
//     description: "by the beach",
//     location: "goa",
//     price: 2000
//   })

//   await sampleTest.save()
//   console.log("Sample was saved");
//   res.send("Successful")
// })

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!!"))
})

// error handler
app.use((err, req, res, next) => {
  let {statusCode=500, message="Some thing went wrong!"} = err
  res.status(statusCode).render("error.ejs", {message})
  // res.status(statusCode).send(message)
})




app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
