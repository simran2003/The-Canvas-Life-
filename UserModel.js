//Import the mongoose module
import pkg from 'mongoose';
const { Schema, model} = pkg;

//Define the Schema for a user
const userSchema = Schema({
    username: String,
    password: {type: String, default: "password"},
    artistType: {type: Boolean, default: true},
    workshops: [],
    following: [],
    likes: [],
    reviews: []
});

//Export the default so it can be imported
export default model("users", userSchema);