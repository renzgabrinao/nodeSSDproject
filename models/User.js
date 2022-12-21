const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

const commentSchema = mongoose.Schema({
    commentAuthor: String,
    commentBody: String
})

// user schema
const userSchema = mongoose.Schema({
    username: {
        type: String,
        index: true,
        required: true
    },

    email: {
        type: String,
        index: true,
        required: true
    },

    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    role: {
        type: String,
        required: true
    },

    interests: {
        type: [String],
    },

    picturePath: {
        type: String
    },

    comments: [commentSchema]
})

userSchema.plugin(passportLocalMongoose);
// Pass the Schema into Mongoose to use as our model
const User = mongoose.model("User", userSchema);
// Export it so that we can use this model in our App
module.exports = User;