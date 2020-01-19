const mongoose = require('mongoose');
const Campground = require('./campground');
const Comment = require("./comment");



function seedDB(){

    Campground.remove({},function(err){

        if(err) console.log(err);

        else{

            console.log("Campgrounds removed");
        }
        // add a few campground
        // data.forEach(function(seed){

        //     Campground.create(seed,function(err,campground){
    
        //         if(err){
        //             console.log(err);
        //         }
        //         else{
                    
        //             console.log("Added the campground" +campground);

        //             //create a comment
        //             Comment.create({
        //                 text:"This is awesome",
        //                 author:"Peter Griffin aka Seth Mcfarlane"
        //             },function(err,comment){

        //                 if(err) {console.log(err);}
        //                 else{
        //                     campground.comments.push(comment);
        //                     campground.save(function(err,campground){
        //                         if(err){
        //                             console.log(err);
        //                         } else{

        //                             console.log("Comment added to campground : "+campground);
        //                             console.log(campground);
        //                         }
        //                     });
        //                 }
        //             });
        //         }
        //     });
        // });
    });
}

module.exports=seedDB;