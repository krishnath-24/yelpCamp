
const express = require('express');
const User    = require('../models/user');
const router = express.Router();
const passport = require('passport');   
//set up the root route
router.get('/',function(req,res){

    res.render('landing');

});


// Auth Routes

// show the register form
router.get('/register',function(req,res){
    res.render('register');
});

// show the login page
router.post('/register',function(req,res){
    
    User.register(new User({username : req.body.username}),req.body.password,function(err,user){

        if(err) {
            console.log('could not register :  '+err);
            res.redirect('/register');
        }
        else{

            passport.authenticate("local")(req,res,function(err,user){
                res.redirect('/campgrounds');
            });
        }
    });
});


// show login form

router.get('/login',function(req,res){

    res.render('login');
});



// add the login route and authenticate the user and login
router.post('/login',passport.authenticate("local",{
    successRedirect :"/campgrounds",
    failureRedirect :"/login"
}),function(req,res){

});


// set up the logout route
router.get('/logout',function(req,res){

    req.logout();
    res.redirect('/login');
});


module.exports = router;