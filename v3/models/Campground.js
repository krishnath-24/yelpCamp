var mongoose=require('mongoose');

//CampGround Schema Setup
var campgroundSchema=mongoose.Schema({
    name:String,
    image:String,
    description:String,
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
});

//export the campground model

module.exports= mongoose.model("campground",campgroundSchema);