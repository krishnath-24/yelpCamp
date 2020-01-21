var mongoose=require('mongoose');

//CampGround Schema Setup
var campgroundSchema=mongoose.Schema({
    name:String,
    price:String,
    image:String,
    description:String,
    author : {

        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        username : String
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
});

//export the campground model

module.exports= mongoose.model("campground",campgroundSchema);