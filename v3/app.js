const express=require('express');
const app=express();
const bodyParser =require('body-parser');
const mongoose=require('mongoose');
const Campground=require('./models/campground');

const seedDB=require('./models/seed');

mongoose.connect("mongodb://localhost:27017/yelp_camp",{useUnifiedTopology: true,useNewUrlParser: true});

//tell app to use body-parser
app.use(bodyParser.urlencoded({extended: true}));

//set up the view engine as ejs
app.set("view engine","ejs");

seedDB();


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
            res.render("index",{campgrounds: allCampgrounds});

        }
    });
});     


//setup the add campgrounds route
app.post('/campgrounds',function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var newCampground={name : name, image : image,description: description};
    // create a new campground and save to db
    Campground.create(newCampground,function(err,campground){

        if(err) console.log(err);
        else{

            // console.log("camp ground added successfully..");
            // console.log(newCampground);
        }
    })
    res.redirect("/campgrounds");
});


//create a form for posting a new campground
app.get('/campgrounds/new',(req,res)=>{
    res.render("new");
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
            res.render("show",{campground: foundCampground });
        }
    });


});


//set up the server
app.listen(3000,function(){
    console.log("YelpCamp Server started!");
});