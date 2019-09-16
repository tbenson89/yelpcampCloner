//========================
// MIDDLEWARE FUNCTIONS 
//Author: A. Tyler Benson
//========================

var middlewareObj 	= {},
	Campground 		= require("../models/campground.js"),
	Comment 		= require("../models/comment.js"),
	msgFlasher		= require("../public/msgFlash.js");

//===================
//	   CAMPGROUND
//     MIDDLEWARE 
//===================
middlewareObj.userCampAuth = function(req , res , next){
// Check is user is logged in
	if(req.isAuthenticated()){
		Campground.findById(req.params.id , function(err , foundCampSite) {
			if (err) {
				req.flash("error" , msgFlasher.noCamp);
				res.redirect("back");
			} else {
				// Does the User Own the Campground
				if(foundCampSite.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error" , msgFlasher.theif);
					res.redirect("back");
				}				
			}
		});
	} else {
		req.flash("error" , msgFlasher.noAuth);
		res.redirect("back");
	}
};

//===================
//      COMMENTS
//     MIDDLEWARE
//===================
middlewareObj.usrCommentAuth = function(req , res , next){
// Check is user is logged in
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id , function(err , foundComment) {
			if (err) {
				res.redirect("back");
			} else {
				// Does the User Own the Comment
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error" , msgFlasher.plager);
					res.redirect("back");
				}				
			}
		});
	} else {
		req.flash("error" , msgFlasher.noAuth);
		res.redirect("back");
	}
};

//===================
//       -AUTH-
//     MIDDLEWARE
//===================
middlewareObj.isLoggedIn = function(req , res , next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error" , msgFlasher.noNewCamp);
	res.redirect("/login");
};

module.exports = middlewareObj;

//   END MIDDLEWARE
//===================
