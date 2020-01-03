var express=require('express');
const app=express();
const bodyParser =require('body-parser');
const mongoose=require('mongoose');

mongoose.connect("mongodb://localhost/yelp_camp");
//tell app to use body-parser
app.use(bodyParser.urlencoded({extended: true}));

//set up the view engine as ejs
app.set("view engine","ejs");


//CampGround Schema Setup
var campgroundSchema=mongoose.Schema({
    name:String,
    image:String
});

//create the schema using the model
var Campground = mongoose.model("campground",campgroundSchema);



// Campground.create({
//     name: "The Epic one",
//     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-ljub75YN7O53EYDsswxMV8x1sNidQpX76xoMdCPvXxUkohMU&s"

// },function(err,campground){

//     if(err){
//         console.log(err);
//     } else{
//         console.log("campground saved : "+campground);
//     }
// });




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
            res.render("campgrounds",{campgrounds: allCampgrounds});

        }
    })
});     


//setup the add campgrounds route
app.post('/campgrounds',function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var newCampground={name : name, image : image};
    // create a new campground and save to db
    Campground.create(newCampground,function(err,campground){

        if(err) console.log(err);
        else{

            console.log("camp ground added successfully..");
            console.log(newCampground);
        }
    })
    res.redirect("/campgrounds");
});


//create a form for posting a new campground
app.get('/campgrounds/new',(req,res)=>{
    res.render("new");
});





//set up the server
app.listen(3000,function(){
    console.log("YelpCamp Server started!");
});