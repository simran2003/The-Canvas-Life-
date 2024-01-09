import express, { query } from 'express';

const app = express();

import session from 'express-session';
import { default as connectMongoDBSession} from 'connect-mongodb-session';

const MongoDBStore = connectMongoDBSession(session);

//Defining the location of the sessions data in the database.
var store = new MongoDBStore({
  uri: 'mongodb://localhost:27017/final_project',
  collection: 'sessions'
});

//Setting up the express sessions to be stored in the database.
app.use(session(
    { 
      secret: 'top secret key',
      resave: true,
      saveUninitialized: false,
      store: store 
    })
);

//Request logger.
import logger from 'morgan'; 

import pkg from 'mongoose';
const { connect, Types } = pkg;

app.use(express.urlencoded({extended: true}));

import User from './UserModel.js';
import Gallery from './GalleryModel.js';


//process.env.PORT will see if there is a specific port set in the environment.
const PORT = process.env.PORT || 3000;

//Root directory for javascript files.
const ROOT_DIR_JS = '/public/js';

//Logging our connections to the express servers.
app.use(logger('dev'));

//Static server will check the following directory.
app.use(express.static("." + ROOT_DIR_JS));

//Convert any JSON stringified strings in a POST request to JSON.
app.use(express.json());

//Setting pug as our template engine.
app.set('views', './views');
app.set('view engine', 'pug');

//router to display artwork
import {router as galleryRouter} from "./gallery-router.js";
app.use("/artworks", galleryRouter);

//gets home page
app.get(['/', '/home'], (req, res) => {
	res.render('home');
});

//gets signup page
app.get('/signup', (req, res) => {
    res.render('signup', { session: req.session });
});

// Saving the user registration to the database.
app.post("/signup", async (req, res) => {
    let newUser = req.body;

    try{
        const searchResult = await User.findOne({ username: newUser.username});
        if(searchResult == null) {
            console.log("registering: " + JSON.stringify(newUser));
            await User.create(newUser);
            res.status(200).send();
        } else {
            console.log("Send error.");
            res.status(404).json({'error': 'Exists'});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error registering" });
    }  

});

//user login
app.post("/login", async (req, res) => {
	let username = req.body.username;
	let password = req.body.password;

  try {
      const searchResult = await User.findOne({ username: username });
      if(searchResult != null) { 
          //successfully matched the username and password, redirect to user profile
          if(searchResult.password === password) {
              req.session.loggedin = true;
              req.session.username = searchResult.username;
              req.session.userid = searchResult._id;
              req.session.workshops = [];
              res.redirect(`http://localhost:3000/user`);
          } else {
              res.status(401).send("Not authorized. Invalid password.");
          }
      } else {
          res.status(401).send("Not authorized. Invalid username.");
      }
  } catch(err) {
      console.log(err);
      res.status(500).json({ error: "Error logging in."});
  }    
});

//gets user profile
app.get("/user", async (req, res) => {
  try {
    //find artwork associated with user, and user in the databases
    const searchResult = await Gallery.find({artist: req.session.username});
    const user = await User.findOne({username: req.session.username});
    req.session.artistType = user.artistType;
    res.render('user-profile', { session: req.session, artworks: searchResult, workshops: user.workshops })
  } catch(err) {
    console.log(err);
    res.status(500).json({ error: "Error finding artwork."});
  }    
}) 

// Log the user out of the application.
app.get("/logout", (req, res) => {
  // Set the session loggedin property to false.
  if(req.session.loggedin) {
    req.session.loggedin = false;
  }
  req.session.workshops = [];
  res.redirect(`http://localhost:3000/home`);
});

//switch user artist type
app.put("/user", async (req, res) => {
  let update;
  if(req.session.artistType == true) {
    update = {"artistType": false};
  } else {
    update = {"artistType": true};
  }

  try{
    const searchResult = await User.findOneAndUpdate({ username: req.session.username }, update, {new: true});
    if(searchResult != null) {
      req.session.artistType = searchResult.artistType;
      res.status(200).send();
    } else {
      console.log("Send error.");
      res.status(404).json({'error': 'user does not exist'});
    }
  } catch(err) {
      console.log(err);
      res.status(500).json({ error: "Error changing artist type."});
  }    
});

//gets page to add new artwork info
app.get("/addArt", (req, res) => {
  res.render("add-artwork", { session: req.session });
})

//gets page to add new workshop info
app.get("/addWorkshop", (req, res) => {
  res.render("workshop", { session: req.session });
})

//gets page to search for artwork on the database
app.get("/searchArtwork", (req, res) => {
  res.render("search", { session: req.session });
})

//gets artist page of specific artist
app.get("/artist/:artist", async (req, res) => {
  let name = req.params.artist;

  try{
    const searchResult = await User.findOne({username: name});
    if(searchResult != null) {
        //find artist's artworks, and current user
        const artworks = await Gallery.find({artist: name})
        const user = await User.findOne({username: req.session.username});
        
        //check if user follows artist
        if(user.following.includes(name)) {
          req.session.following = true;
        } else {
          req.session.following = false;
        }
        res.render("artist-profile", {artist: searchResult, artworks: artworks, following: req.session.following})
    } else {
        console.log("Send error.");
        res.status(404).json({'error': 'no artist'});
    }
  } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Error finding artist" });
  } 
})

//add or remove following for specific artist
app.put("/following", async (req, res) =>{
  let artist = req.body.artist;
  let update;

  if(req.session.following) { //following
    update = {$pull: {following: artist}}
  } else { //not following
    update = {$push: {following: artist}}
  }

  try{
    const searchResult = await User.findOneAndUpdate({ username: req.session.username }, update, {new: true});
    if(searchResult != null) {
      res.status(200).send();
    } else {
      console.log("Send error.");
      res.status(404).json({'error': 'user does not exist'});
    }
  } catch(err) {
      console.log(err);
      res.status(500).json({ error: "Error changing following."});
  }    
})

//gets user's following page and displays the artists they follow
app.get("/following", async (req, res) =>{
  try{
    const searchResult = await User.findOne({username: req.session.username});
    if(searchResult != null) {
        const following = searchResult.following
        res.render("following", {following: following})
    } else {
        console.log("Send error.");
        res.status(404).json({'error': 'no artist'});
    }
  } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Error finding artist" });
  } 
})

//adds workshop to user account
app.post("/addWorkshop", async (req, res) =>{
  let title = req.body.title;

  try {
      const searchResult = await User.findOneAndUpdate({ username: req.session.username }, {$push: {workshops: title}}, {new: true});
      if(searchResult != null) { 
        req.session.workshops = searchResult.workshops;
        res.redirect(`http://localhost:3000/user`);
      } else {
          res.status(401).send("User does not exist.");
      }
  } catch(err) {
      console.log(err);
      res.status(500).json({ error: "Error adding workshop."});
  }    
})

//displays page with info about specific artwork
app.get("/artpiece/:name", async (req, res) => {
  try {
    const searchResult = await Gallery.findOne({ name: req.params.name });
    if(searchResult != null) { 
      const user = await User.findOne({username: req.session.username});

      //check if user likes the artwork
      if(user.likes.includes(req.params.name)) {
        req.session.likes = true;
      } else {
        req.session.likes = false;
      }
      res.render("artwork", {artwork: searchResult, likes: req.session.likes});
    } else {
        res.status(401).send("Artwork does not exist.");
    }
  } catch(err) {
      console.log(err);
      res.status(500).json({ error: "Error finding artwork."});
  }    
})

//add art to user's account
app.post("/addArt", async (req, res) => {
	let name = req.body.name;
  let year = req.body.year;
  let medium = req.body.medium;
  let category = req.body.category;
  let description = req.body.description;
  let image = req.body.image;
  let artwork = {
    name: name, 
    artist: req.session.username, 
    year: year,
    medium: medium,  
    category: category, 
    description: description, 
    image: image
  }

  try {
    //check if artwork with name already exists
    const existing = await Gallery.findOne({name: {"$regex": name, "$options": "i"}});
    if(existing != null) {
      res.status(404).render({'error': 'Exists'});
    } else {
      //find user in database and add artwork
      const searchResult = await User.findOne({ username: req.session.username });
      if(searchResult != null) { 
        await Gallery.create(artwork);
        res.redirect(`http://localhost:3000/user`);
          
      } else {
          res.status(401).send("user not found.");
      }
    }
  } catch(err) {
      console.log(err);
      res.status(500).json({ error: "Error adding artwork."});
  }    
});

//like or unlike artwork
app.put("/like", async (req, res) =>{
  let name = req.body.name;
  let update;

  if(req.session.likes) { //likes artwork
    update = {$pull: {likes: name}}
  } else { //doesn't like artwork
    update = {$push: {likes: name}}
  }

  req.session.likes = !req.session.likes;

  try{
    const searchResult = await User.findOneAndUpdate({ username: req.session.username }, update, {new: true});
    await Gallery.findOneAndUpdate({name: name}, update, {new: true})
    if(searchResult != null) {
      res.status(200).send();
    } else {
      console.log("Send error.");
      res.status(404).json({'error': 'user does not exist'});
    }
  } catch(err) {
      console.log(err);
      res.status(500).json({ error: "Error changing like."});
  }    
})

//display user's likes
app.get("/reviews", async (req, res) =>{
  try{
    const searchResult = await User.findOne({ username: req.session.username });
    if(searchResult != null) {
      res.render("reviews", {user: searchResult});
    } else {
      console.log("Send error.");
      res.status(404).json({'error': 'user does not exist'});
    }
  } catch(err) {
      console.log(err);
      res.status(500).json({ error: "Error finding user."});
  } 
})

//unlike artwork from user database
app.put("/unlike", async (req, res) =>{
  console.log(req.body);
  try{
    const searchResult = await User.findOneAndUpdate({ username: req.session.username }, {$pull: {likes: req.body.name}}, {new: true});
    await Gallery.findOneAndUpdate({name: req.body.name}, {$pull: {likes: req.body.name}}, {new: true})
    if(searchResult != null) {
      res.status(200).send();
    } else {
      console.log("Send error.");
      res.status(404).json({'error': 'user does not exist'});
    }
  } catch(err) {
      console.log(err);
      res.status(500).json({ error: "Error changing like."});
  }    
})

//enroll to artist workshop
app.post("/enroll", (req, res) =>{
  console.log("enrolling");
  res.status(200).send("you are enrolled");
});

// Create an async function to load the data.
const loadData = async () => {
	//Connect to the mongo database
  	const result = await connect('mongodb://localhost:27017/final_project');
    return result;
};

// Call to load the data.
loadData()
  .then(() => {

    app.listen(PORT);
    console.log("Listen on port:", PORT);

  })
  .catch(err => console.log(err));