const express = require('express');
const Comment = require('../models/comment');
const Campground = require('../models/campground');
const router = express.Router({mergeParams:true});
const middleware = require('../middleware');

//Comment Routes

// the add new comment route
router.get('/new',middleware.isLoggedIn,function(req,res){

    Campground.findById(req.params.id,function(err,foundCampground){

        if(err || !foundCampground) {
            console.log(err);
            req.flash("error","Campground Not Found");
            res.redirect("back");
        }

        else{
            res.render('comments/new',{campground:foundCampground});
        }
    });
});


// Comment post route
router.post('/',middleware.isLoggedIn,function(req,res){

    Campground.findById(req.params.id,function(err,foundCampground){

        var comment =req.body.comment;

        Comment.create(comment,function(err,comment){

            if(err){
                req.flash("error","Something went wrong");

            } else{
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                console.log(comment);
                foundCampground.comments.push(comment);
                foundCampground.save();
                req.flash("success","Comment created succesfully");
                res.redirect('/campgrounds/'+foundCampground._id);
            }
            
        });
    });
});


// add the edit commment route

router.get('/:comment_id/edit',middleware.checkCommentOwnership,function(req,res){

    Comment.findById(req.params.comment_id,function(err,foundComment){

        if(err){
            res.redirect("back");
        } else{

            res.render('comments/edit',{campground_id : req.params.id,comment : foundComment});
        }
    })
});

// add the update comment route

router.put('/:comment_id',middleware.checkCommentOwnership,function(req,res){

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
router.delete('/:comment_id',middleware.checkCommentOwnership,function(req,res){
    
    //find the comment and remove it
    Comment.findByIdAndRemove(req.params.comment_id,function(err,deletedComment){
        if(err){
            console.log(err);
            req.flash("error","Something went wrong!");     
            res.redirect("back");
        } 

        else{

            console.log(deletedComment);
            req.flash("success","Comment Deleted!");
            res.redirect("back");
        }
    })
});


module.exports = router;