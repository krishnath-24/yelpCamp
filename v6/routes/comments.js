const express = require('express');
const Comment = require('../models/comment');
const Campground = require('../models/campground');
const router = express.Router({mergeParams:true});


//Comment Routes
router.get('/new',isLoggedIn,function(req,res){

    Campground.findById(req.params.id,function(err,campground){

        if(err) console.log(err);

        else{
            res.render('comments/new',{campground:campground});
        }
    });
});


// Comment post route
router.post('/',isLoggedIn,function(req,res){

    Campground.findById(req.params.id,function(err,foundCampground){

        var comment =req.body.comment;

        Comment.create(comment,function(err,comment){

            foundCampground.comments.push(comment);
            foundCampground.save();
            res.redirect('/campgrounds/'+foundCampground._id);

        });
    });
});

function isLoggedIn(req,res,next){

    if(req.isAuthenticated()){
        next();
    } else{
        res.redirect('/campgrounds'); 
    }
}
module.exports = router;
