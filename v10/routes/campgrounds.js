
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
router.post('/',isLoggedIn,function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var newCampground={name : name, image : image,description: description,
        author : {id : req.user._id, username : req.user.username}};
    // create a new campground and save to db
    console.log(newCampground);
    console.log("creating a campground");
    Campground.create(newCampground,function(err,campground){

        if(err) console.log(err);
        else{
            res.redirect("/campgrounds");
        }
    })
});


//create a form for posting a new campground
router.get('/new',isLoggedIn,(req,res)=>{
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

//  Edit Campground route
router.get('/:id/edit',checkCampgroundOwnership,function(req,res){

    Campground.findById(req.params.id,function(err,foundCampground){
        res.render("campgrounds/edit",{campground : foundCampground});
    });
});


// update campground route

router.put('/:id',checkCampgroundOwnership,function(req,res){

    //find the campground with the associated id
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect('/campgrounds');
        } else{
            res.redirect('/campgrounds/'+req.params.id);
        }
    });
});

//  destroy campground route

router.delete('/:id',checkCampgroundOwnership,function(req,res){
    
    Campground.findByIdAndRemove(req.params.id,function(err,deletedCampground){

        if(err){
            res.redirect('/campgrounds');
        } else{
            res.redirect('/campgrounds');
        }
    })
});









// middlewares
function isLoggedIn(req,res,next){

    if(req.isAuthenticated()){
        next();
    } else{
        res.redirect('/login'); 
    }
}

function checkCampgroundOwnership(req,res,next){
    
    if(req.isAuthenticated()){

        Campground.findById(req.params.id,function(err,foundCampground){

            if(err){
                console.log(err);
                res.redirect("back");   
            } else{

                if(foundCampground.author.id.equals(req.user._id)){

                    next();

                } else{
                    res.redirect("back");
                }
            }
        });

    } else{
        res.redirect("back");
    }
}

module.exports = router;
