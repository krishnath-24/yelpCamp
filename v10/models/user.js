
const mongoose =require('mongoose'),
      passportLocalMongoose =require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username : String,
    password : String,
    isAdmin  : {type : Boolean, default : false}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user",userSchema);