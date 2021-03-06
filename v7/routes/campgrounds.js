
const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
//add the show campgrounds route
router.get('/',(req,res)=>{   

    //get all campgorunds from the db
    Campground.find({},function(err,allCampgrounds){

        if(err) console.log(err);

        else{
            res.render("campgrounds/index",{campgrounds: allCampgrounds,user:req.user});

        }
    });
});     


//setup the add campgrounds route
router.post('/',function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var newCampground={name : name, image : image,description: description};
    // create a new campground and save to db
    console.log("creating a campground");
    Campground.create(newCampground,function(err,campground){

        if(err) console.log(err);
        else{
            res.redirect("/campgrounds");
        }
    })
});


//create a form for posting a new campground
router.get('/new',(req,res)=>{
    res.render("campgrounds/new");
});


//create a route for showing a campground with given id
router.get('/:id',function(req, res){

    //find all campgroud with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){

        if(err){
            console.log("There was an error in finding the campground "+err);
       
        } else{

            //render show page of those campgrounds
            res.render("campgrounds/show",{campground: foundCampground });
        }
    });


});

module.exports = router;
