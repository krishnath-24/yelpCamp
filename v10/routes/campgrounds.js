
const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');    
//add the show campgrounds route
router.get('/',(req,res)=>{
    
    if(req.query.search){

        var noMatch;
        const regex = new RegExp(escapeRegex(req.query.search),'gi');

        Campground.find({name : regex},function(err,campgrounds){

            if(err){
                console.log(err);
                res.redirect('/campgrounds');
            } else{


                if(campgrounds.length<1){
                    noMatch  = "No campground found, Please try again";
                }
                res.render("campgrounds/index",{campgrounds: campgrounds,page : 'campgrounds',noMatch : noMatch});
            }
        });

    } else{

        //get all campgorunds from the db
        Campground.find({},function(err,allCampgrounds){
            if(err) console.log(err);
            else{
                res.render("campgrounds/index",{campgrounds: allCampgrounds,page : 'campgrounds',noMatch: noMatch});
            }
        });
    }

    
});     


//setup the add campgrounds route
router.post('/',middleware.isLoggedIn,function(req,res){

    var name=req.body.name;
    var image=req.body.image;
    var price= req.body.price;
    var description=req.body.description;
    var newCampground={name : name, image : image,price : price,description: description,
        author : {id : req.user._id, username : req.user.username}};
    // create a new campground and save to db
    console.log(newCampground);
    console.log("creating a campground");
    Campground.create(newCampground,function(err,campground){

        if(err) console.log(err);
        else{
            res.redirect("/campgrounds");
        }
    });
});


//create a form for posting a new campground
router.get('/new',middleware.isLoggedIn,(req,res)=>{
    res.render("campgrounds/new");
});


//create a route for showing a campground with given id
router.get('/:id',function(req, res){

    //find all campgroud with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){

        if(err || !foundCampground){
            console.log("There was an error in finding the campground "+err);
            req.flash("error","Campground Not Found");
            res.redirect("/campgrounds");
        } else{

            //render show page of those campgrounds
            res.render("campgrounds/show",{campground: foundCampground });
        }
    });


});

//  Edit Campground route
router.get('/:id/edit',middleware.checkCampgroundOwnership,function(req,res){

    Campground.findById(req.params.id,function(err,foundCampground){
        
        if(err) res.redirect("back");
        
        else
        res.render("campgrounds/edit",{campground : foundCampground});
    });
});


// update campground route

router.put('/:id',middleware.checkCampgroundOwnership,function(req,res){

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

router.delete('/:id',middleware.checkCampgroundOwnership,function(req,res){
    
    Campground.findByIdAndRemove(req.params.id,function(err,deletedCampground){

        if(err){
            console.log(err);   
            res.redirect('/campgrounds');
        } else{
            res.redirect('/campgrounds');
        }
    })
});



// utility function to perform fuzzy search
function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;
