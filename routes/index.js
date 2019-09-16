//===================
//  EXPRESS ROUTER
//===================
var express 	= require("express"),
	passport	= require("passport"),
	msgFlasher	= require("../public/msgFlash.js"),
	User 		= require("../models/user.js");

var router = express.Router();

router.get("/" , function(req , res) {
	res.render("landing");
});

router.get("/register" , function(req , res){
	res.render("register");
});
// Registration POST
router.post("/register" , function(req , res) {
	var newUser = new User({username: req.body.username});
	User.register(newUser , req.body.password , function(err , user){
		if(err){
			return res.render("register" , {"error": err.message});
		} 
		passport.authenticate("local")(req , res , function(){
			req.flash("success" , "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});
router.get("/login" , function(req , res){
	res.render("login");
});
// Login Logic 
router.post("/login" , passport.authenticate("local" , {
	// Middleware 
	successRedirect: "/campgrounds",
	failureRedirect: "/login",
    failureFlash: true,
    successFlash: true
}) , function(req , res){}); 


router.get("/logout" , function(req , res){
	req.logout();
	req.flash("success" , msgFlasher.usrLogout);
	res.redirect("/");
});

module.exports = router;