import Gallery from './GalleryModel.js';
import express from 'express';
let router = express.Router();
export {router};

router.get("/", queryParser);
router.get("/", loadGalleryDatabase);
router.get("/", respondArtworks);

//Parse the query parameters
function queryParser(req, res, next){
	const MAX_ARTWORKS = 50;

	//build a query string to use for pagination later
	console.log(typeof req.query);
	let prop = Object.keys(req.query);
	let params = [];
	for(prop in req.query){
		if(prop == "page"){
			continue;
		}
		params.push(prop + "=" + req.query[prop]);
	}
	req.qstring = params.join("&");
	
	try{
		req.query.limit = req.query.limit || 10;
		req.query.limit = Number(req.query.limit);
		if(req.query.limit > MAX_ARTWORKS){ 
			req.query.limit = MAX_ARTWORKS;
		}
	}catch{
		req.query.limit = 10;
	}
	
	try{
		req.query.page = req.query.page || 1;
		req.query.page = Number(req.query.page);
		if(req.query.page < 1){
			req.query.page = 1;
		}
	}catch{
		req.query.page = 1;
	}

	if(!req.query.name){
		req.query.name = "?";
	}

	if(!req.query.category){
		req.query.category = "?";
	}

	if(!req.query.artist){
		req.query.artist = "?";
	}
			
	next();
}

//Find mathching artwork by querying Gallery model
function loadGalleryDatabase(req, res, next){
	let startIndex = ((req.query.page-1) * req.query.limit);
	let amount = req.query.limit;

	console.log(req.query.name);
	
	//find artwork based on name, artist, and category types
	Gallery.find()
	.where("name").regex(new RegExp(".*" + req.query.name + ".*", "i"))
	.where("artist").regex(new RegExp(".*" + req.query.artist + ".*", "i"))
	.where("category").regex(new RegExp(".*" + req.query.category + ".*", "i"))
	.limit(amount)
	.skip(startIndex)
	.exec(function(err, results){
		if(err){
			res.status(500).send("Error reading artwork.");
			console.log(err);
			return;
		}
		console.log("Found " + results.length + " matching artworks.");
		res.artworks = results;
		next();
		return;
	})
}

//Sends an array of products in response to a request
function respondArtworks(req, res, next){
	res.format({
		"text/html": () => {res.render("artworks", {artworks: res.artworks, qstring: req.qstring, current: req.query.page } )},
		"application/json": () => {res.status(200).json(res.artworks)}
	});
	next();
}
