var mongoose=require('mongoose');

//CampGround Schema Setup
var campgroundSchema=mongoose.Schema({
    name:String,
    image:String,
    description:String
});

//export the campground model

module.exports= mongoose.model("campground",campgroundSchema);