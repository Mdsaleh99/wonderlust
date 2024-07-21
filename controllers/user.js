const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password); // register(user, password, cb) Convenience method to register a new user instance with a given password. Checks if username is unique. See login example.
    // https://github.com/saintedlama/passport-local-mongoose/tree/main/examples/login
    // in passport pbkdf2 hashing algorithm use

    req.login(registeredUser, (err) => {
      // Passport exposes a login() function on req (also aliased as logIn()) that can be used to establish a login session.   When the login operation completes, user will be assigned to req.user.
      if (err) {
        return next(err);
      }
      //   console.log(registeredUser);
      req.flash("success", "Signup successfully");
      res.redirect("/listings");

      /**
         Note: passport.authenticate() middleware invokes req.login() automatically. This function is   primarily used when users sign up, during which req.login() can be invoked to automatically log in the newly registered user.
         *
         */
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};


module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  req.flash("success", "You are Logged in!");
  // res.redirect(req.session.redirectUrl); // in passport jab user login hojata hai aur success message de deta hai aur tab passport req.session ko reset kardeta hai tab hamare pass redirectUrl ki access nhi hoti tho ye empty undefined hoga. isse bachne k liye hum dusara middleware create karenge aur redirectUrl ko res.locals me store karvaenge aur passport k pass res.locals ko delete karne ki access nhi hoga

  // res.redirect(res.locals.redirectUrl);  // jab home page se login karne k baad page not found aara tha because isLoggedIn middleware trigger hua hi nhi jab ye nhi hua req.session.redirectUrl k andar original url save hua hi nhi aur ye save nhi hua to locals k andar b save nhi hua jo saveRidirectUrl middleware k andar hai aur iske andar save nhi hua to res.redirect(res.locals.redirectUrl) k andar b save nhi hua aur ye undefined aara hai aur isse bachne k liye condition check karna padega empty hai ya nhi hai so isliye neeche ki line lihki hai let redirectUrl = res.locals.redirectUrl || "/listings";

  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};


module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};