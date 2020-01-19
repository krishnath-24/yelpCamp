// All the middlewares go here

var middlewares = {};

middlewares.checkCamgroundOwnership = function(req,res,next){

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

middlewares.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){

        Comment.findById(req.params.Comment_id,function(err,foundComment){

            if(err){
                console.log(err);
                res.redirect("back");   
            } else{

                if(foundComment.author.id.equals(req.user._id)){

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

middlewares.isLoggedIn = function(req,res,next){

    if(req.isAuthenticated()){

        next();

    } else{

        res.redirect("back");
    }
}