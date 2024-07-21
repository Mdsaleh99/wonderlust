const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")

// https://www.npmjs.com/package/passport
// https://www.npmjs.com/package/passport-local
// https://www.npmjs.com/package/passport-local-mongoose




// ========================= READ THIS PROPERLY =====================
// https://www.npmjs.com/package/passport-local-mongoose#plugin-passport-local-mongoose
// https://github.com/saintedlama/passport-local-mongoose#api-documentation
// You're free to define your User how you like. Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value.
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', userSchema)

