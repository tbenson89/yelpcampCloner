//===================
//  EXPRESS ROUTER
//===================
var express = require("express"),
	middleware	= require("../middleware"),
	Campground 	= require("../models/campground.js"),
	msgFlasher	= require("../public/msgFlash.js"), 
	Comment 	= require("../models/comment.js");
	
var router = express.Router({mergeParams: true});

// NEW FORM COMMENT 
router.get("/new" , middleware.isLoggedIn , function(req , res){
	Campground.findById(req.params.id , function(err , campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new" , {campground: campground});
		}
	});
	
});

// CREATE COMMENT ROUTE
router.post("/" , middleware.isLoggedIn , function(req , res){
	// Find Campground by ID 
	Campground.findById(req.params.id , function(err , campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			// Create NEW Comment
			Comment.create(req.body.comment , function(err , comment){
				if(err){
					req.flash(msgFlasher.wild);
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();

					// Connect Comment to Campground
					campground.comments.push(comment);
					campground.save();
					req.flash("success" , msgFlasher.wahoo);
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	})
});

// EDIT ROUTE
router.get("/:comment_id/edit" , middleware.usrCommentAuth , function(req , res){
	Comment.findById(req.params.comment_id , function(err , foundComment){
		if(err){
			res.redirect("back");
			console.log(err);
		} else {
			res.render("comments/edit" , {campground_id: req.params.id , comment: foundComment});
		}
	});
});

// UPDATE ROUTE
router.put("/:comment_id" , middleware.usrCommentAuth , function(req , res){
	Comment.findByIdAndUpdate(req.params.comment_id , req.body.comment , function(err , updatedComment){
		if(err){
			console.log(err);
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY ROUTE
router.delete("/:comment_id" , middleware.usrCommentAuth , function(req , res){
	Comment.findByIdAndRemove(req.params.comment_id , function(err , deletedComment){
		if(err){
			res.redirect("back");
			console.log(err);
		} else {
			req.flash("success" , msgFlasher.commentDemo);
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


module.exports = router;