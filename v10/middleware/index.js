var Comment     = require('../models/comment'),
    Campground  = require('../models/campground');



// All the middlewares go here

var middlewares = {};


middlewares.checkCampgroundOwnership = function(req,res,next){

    if(req.isAuthenticated()){

        Campground.findById(req.params.id,function(err,foundCampground){

            if(err || !foundCampground){
                console.log(err);
                req.flash("error","Campground Not Found ");
                res.redirect("back");   
            } else{

                if(foundCampground.author.id.equals(req.user._id)){

                    next();

                } else{
                    console.log(foundCampground.author +" "+req.user.username);
                    req.flash("error","Permission denied!");
                    res.redirect("back");
                }
            }
        });

    } else{
        req.flash("error","You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewares.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){

        Campground.findById(req.params.id,function(err,foundCampground){

            if(err || !foundCampground){

                req.flash("error","Campground Not Found");
                res.redirect("back");
            } else{
                
                Comment.findById(req.params.comment_id,function(err,foundComment){

                    if(err || !foundComment){
                        req.flash("error","Comment not found");
                        console.log(err);
                        res.redirect("back");   
                    } else{

                        if(foundComment.author.id.equals(req.user._id)){
                            next();

                        } else{
                            req.flash("error","Permission Denied!");
                            res.redirect("back");
                        }
                    }
                });

            }
        });


    } else{
        req.flash("error","You need to be logged in to do that.");
        res.redirect("back");
    }
}

middlewares.isLoggedIn = function(req,res,next){

    if(req.isAuthenticated()){

        next();

    } else{

        req.flash("error","You need to be logged in to do that!");
        res.redirect("/login");
    }
}

module.exports = middlewares;