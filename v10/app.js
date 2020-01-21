const express               =   require('express');
      app                   =   express();
      bodyParser            =   require('body-parser');
      mongoose              =   require('mongoose');
      Campground            =   require(__dirname+'/models/campground');
      Comment               =   require(__dirname+'/models/comment');
      passport              =   require('passport'),
      LocalStrategy         =   require('passport-local'),
      passportLocalMongoose =   require('passport-local-mongoose');
      User                  =   require('./models/user'),
      methodOverride        =   require('method-override'),
      flash                 =   require('connect-flash');

var commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    authRoutes = require('./routes/index');



mongoose.connect("mongodb://localhost:27017/yelp_camp",{useUnifiedTopology: true,useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

//use connect-flash
app.use(flash());


//tell app to use body-parser
app.use(bodyParser.urlencoded({extended: true}));

//set up the view engine as ejs
app.set("view engine","ejs");

// use method override package
app.use(methodOverride("_method"));



// Passport configuration
app.use(require('express-session')({
    secret:"I am going all in",
    resave:false,
    expires: new Date(Date.now() + (5000)),
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(__dirname+"/public"));

// make the logged in user available to every route
app.use(function(req,res,next){
    res.locals.user=req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next(); 
});

// use all the different router
// the first argument appends the route specified to the route
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/",authRoutes);




//set up the server
app.listen(3000,function(){
    console.log("YelpCamp Server started!");
});