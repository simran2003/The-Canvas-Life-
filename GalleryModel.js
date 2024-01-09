//Import the mongoose module
import pkg from 'mongoose';
const { Schema, model} = pkg;

//Define the Schema for gallery
const gallerySchema = Schema({
    name: String,
    artist: String,
    year: String,
    category: String,
    medium: String,
    description: String,
    image: String,
    likes: [],
    ratings: {type: Array, default: [-1, -1]},
    reviews: []
});

//Export the default so it can be imported
export default model("gallery", gallerySchema);