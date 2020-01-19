const express = require('express');
const Comment = require('../models/comment');
const Campground = require('../models/campground');
const router = express.Router({mergeParams:true});


//Comment Routes

// the add new comment route
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

            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();
            console.log(comment);
            foundCampground.comments.push(comment);
            foundCampground.save();
            res.redirect('/campgrounds/'+foundCampground._id);
        });
    });
});


// add the edit commment route

router.get('/:comment_id/edit',function(req,res){

    Comment.findById(req.params.comment_id,function(err,foundComment){

        if(err){
            res.redirect("back");
        } else{

            res.render('comments/edit',{campground_id : req.params.id,comment : foundComment});
        }
    })
});

// add the update comment route

router.put('/:comment_id',function(req,res){

    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){

        if(err){
            console.log(err);
            res.redirect("back");
        } else{

            res.redirect('/campgrounds/'+req.params.id);
        }
    });
}); 

// Comment destroy route
router.delete('/:comment_id',function(req,res){
    
    //find the comment and remove it
    Comment.findByIdAndRemove(req.params.comment_id,function(err,deletedComment){
        if(err){
            console.log(err);
            res.redirect("back");
        } 

        else{

            console.log(deletedComment);
            res.redirect("back");
        }
    })
});



// middleware
function isLoggedIn(req,res,next){

    if(req.isAuthenticated()){
        next();
    } else{
        res.redirect('/login'); 
    }
}
module.exports = router;
