//===================
//  EXPRESS ROUTER
//===================
var express 	= require("express"),
	middleware	= require("../middleware"), // AUtomically targets index.js :) 
	msgFlasher	= require("../public/msgFlash.js"), // user prompt message lib
	Campground 	= require("../models/campground.js");

var router = express.Router();

// Display All Campgrounds Route
router.get("/" , function(req , res){
	// get all campgrounds 
	Campground.find({} , function(err , allSites){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index" , {campgrounds: allSites , currentUser: req.user});
		}
	});
});
// Create Campground Route
router.post("/" , middleware.isLoggedIn , function(req , res){
	var name 	= req.body.name,
		price	= req.body.price,
		image 	= req.body.image,
		descr 	= req.body.descr;

	var author = {
		id: req.user._id,
		username: req.user.username
	};

	var newCampground = {name: name, price: price, image: image, descr: descr, author: author};
	// create new campground 
	Campground.create(newCampground , function(err , newCamp){
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});
// New Campground Form Route
router.get("/new" , middleware.isLoggedIn , function(req , res){
	res.render("campgrounds/new");
});
// Show Campground Route
router.get("/:id" , function(req , res){
	// Find the Campground that is desired
	Campground.findById(req.params.id).populate("comments").exec(function(err , foundCampSite){
		if(err){
			console.log(err);
		} else {
			// Render the Show Template for UniqueID Campground
			res.render("campgrounds/show" , {campground: foundCampSite});
		}
	});
});
// Edit Campground Route
router.get("/:id/edit" , middleware.userCampAuth , function(req , res) {
	Campground.findById(req.params.id , function(err , foundCampSite) {
		if (err) {
			res.redirect("back");
		} else {
			res.render("campgrounds/edit" , {campground: foundCampSite});				
		}
	});
});
// Update Campground 
router.put("/:id" , middleware.userCampAuth , function(req , res) {
	// Logic 
	Campground.findByIdAndUpdate(req.params.id , req.body.campground , function(err , updatedCampsite) {
		if(err) {
			console.log("Error from the Update Route!");
			console.log(updatedCampsite);
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});
// DESTROY Campground Route
router.delete("/:id" , middleware.userCampAuth , function(req , res){
	// LOgic 
	Campground.findByIdAndRemove(req.params.id , function(err , rmvCampy){
		if(err){
			console.log("Error From the Delete Route!");
			console.log(rmvCampy);
			console.log(err);
			res.redirect("/:id");
		} else {
			res.redirect("/campgrounds");
		}
	});
});


module.exports = router;