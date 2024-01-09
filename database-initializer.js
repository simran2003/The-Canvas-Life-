//Array of registered users.
const users = [
	{'username': 'artist', 'password':'password', 'artistType': false},
    {'username': 'lizard', 'password':'password', 'artistType': false}
];

//Import the mongoose module.
import pkg from 'mongoose';

const { connect, connection } = pkg;

//Import the User models.
import User from './UserModel.js';
import Gallery from './GalleryModel.js';

import galleryData from './gallery.json' assert {type: "json"};

//Create an async function to load the data.
const loadData = async () => {
	
	//Connect to the mongo database.
  	await connect('mongodb://localhost:27017/final_project');

	//Remove database and start anew.
	await connection.dropDatabase();
	
	//Map each registered user object into the a new User model.
	let artists =[];
	let tracker = [];

	//add artists from gallery into artist array
	galleryData.forEach(artwork => {
		if(!tracker.includes(artwork.artist)) {
			tracker.push(artwork.artist);
			artists.push({username: artwork.artist});
		}
	})
	
	//add artists to user database and artwork to gallery database
	let access = artists.map(aUser => new User(aUser));
	console.log(access);
	let artworkData = galleryData.map(art => new Gallery(art));

	await User.create(access);
	await Gallery.create(artworkData);
}

//Call to load the data.
loadData()
  .then((result) => {
	console.log("Closing database connection.");
 	connection.close();
  })
  .catch(err => console.log(err));