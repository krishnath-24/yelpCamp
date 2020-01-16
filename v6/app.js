const express               =   require('express');
      app                   =   express();
      bodyParser            =   require('body-parser');
      mongoose              =   require('mongoose');
      Campground            =   require(__dirname+'/models/campground');
      Comment               =   require(__dirname+'/models/comment');
      seedDB                =   require('./models/seed'),
      passport              =   require('passport'),
      LocalStrategy         =   require('passport-local'),
      passportLocalMongoose =   require('passport-local-mongoose');
      User                  =   require('./models/user');   
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useUnifiedTopology: true,useNewUrlParser: true});

//tell app to use body-parser
app.use(bodyParser.urlencoded({extended: true}));

//set up the view engine as ejs
app.set("view engine","ejs");

// seedDB();

// Passport configuratiion
app.use(require('express-session')({
    secret:"I am going all in",
    resave:false,
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
    next(); 
});

//set up the home route
app.get('/',function(req,res){

    res.render('landing');

});

//add the show campgrounds route
app.get('/campgrounds',(req,res)=>{   

    //get all campgorunds from the db
    Campground.find({},function(err,allCampgrounds){

        if(err) console.log(err);

        else{
            res.render("campgrounds/index",{campgrounds: allCampgrounds,user:req.user});

        }
    });
});     


//setup the add campgrounds route
app.post('/campgrounds',isLoggedIn,function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var newCampground={name : name, image : image,description: description};
    // create a new campground and save to db
    Campground.create(newCampground,function(err,campground){

        if(err) console.log(err);
        else{
            res.redirect("/campgrounds");
        }
    })
});


//create a form for posting a new campground
app.get('/campgrounds/new',(req,res)=>{
    res.render("campgrounds/new");
});


//create a route for showing a campground with given id
app.get('/campgrounds/:id',function(req, res){

    //find all campgroud with provided id
    console.log("id"+" "+req.params.id);
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){

        if(err){
            console.log("There was an error in finding the campground "+err);
       
        } else{

            //render show page of those campgrounds
            console.log(foundCampground.description);
            res.render("campgrounds/show",{campground: foundCampground });
        }
    });


});



//Comment Routes

app.get('/campgrounds/:id/comments/new',isLoggedIn,function(req,res){

    Campground.findById(req.params.id,function(err,campground){

        if(err) console.log(err);

        else{
            res.render('comments/new',{campground:campground});
        }
    })
});


// Comment post route
app.post('/campgrounds/:id/comments',isLoggedIn,function(req,res){

    Campground.findById(req.params.id,function(err,foundCampground){

        var comment =req.body.comment;

        Comment.create(comment,function(err,comment){

            foundCampground.comments.push(comment);
            foundCampground.save();
            res.redirect('/campgrounds/'+foundCampground._id);

        });
    });
});

// Auth Routes

// show the register form
app.get('/register',function(req,res){
    res.render('register');
});

// show the login page
app.post('/register',function(req,res){
    
    User.register(new User({username : req.body.username}),req.body.password,function(err,user){

        if(err) {
            console.log('could not register :  '+err);
            res.redirect('/register');
        }
        else{

            passport.authenticate("local")(req,res,function(err,user){
                res.redirect('/campgrounds');
            });
        }
    });
});


// show login form

app.get('/login',function(req,res){

    res.render('login');
});



// add the login route and authenticate the user and login
app.post('/login',passport.authenticate("local",{
    successRedirect :"/campgrounds",
    failureRedirect :"/login"
}),function(req,res){

});


// set up the logout route
app.get('/logout',function(req,res){

    req.logout();
    res.redirect('/login');
});


function isLoggedIn(req,res,next){

    if(req.isAuthenticated()){
        next();
    } else{
        res.redirect('/campgrounds'); 
    }
}


//set up the server
app.listen(3000,function(){
    console.log("YelpCamp Server started!");
});