const PORT 		= 8080; // Bad PORT usage Change! 
const errMsg = "UH OH, there was an Error"; // nice prompt when there is a callback error

var express 		= require("express"), // Express Framework
	app 			= express(), 
	flash			= require("connect-flash"), // The Flash (prompts)
	expressSession	= require("express-session"), // session-packages
	bodyParser 		= require("body-parser"), // req for reading req. 
	seedDB			= require("./seeds.js"), // Seeing the DB
	mongoose 		= require("mongoose"), // DB mongo ODM
	passport 		= require("passport"),
	methodOverride	= require("method-override"), // Method - Override 
	LocalStrategy	= require("passport-local"), // Local Package passport
	mongoPassport	= require("passport-local-mongoose"); // mongo local passport package

var Campground  	= require("./models/campground"), // Campground Model
	Comment  		= require("./models/comment"), // Comment Model
	User 			= require("./models/user"); // User Model

var indexRoute		= require("./routes/index.js"), // Index Routes
	commentRoute	= require("./routes/comments.js"), // Comment Routes
	campgroundRoute = require("./routes/campgrounds.js"); // Campground Routes

//==================
//   CONFIGURATION
//==================
mongoose.connect("mongodb://localhost:27017/yelp_camp" , {useNewUrlParser: true});
app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// Serving the directory, tells the framework where to look
app.use(express.static(__dirname + "/public"));

// Implementing Method Override 
app.use(methodOverride("_method"));

/* Undelete to SEED the DB */
// seedDB();

app.use(expressSession ({
	secret: "Utah is so beautiful!!!!",
	resave: false,
	saveUninitialized: false
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req , res, next){
	// Gives Global Acces to Current User :) 
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoute);
app.use("/campgrounds/:id/comments/" , commentRoute);
app.use("/campgrounds" , campgroundRoute);

// START SERVER
app.listen(PORT , function(req , res){
	console.log("YelpCampServer ON....");
});
