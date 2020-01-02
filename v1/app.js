var express=require('express');
const app=express();
const bodyParser =require('body-parser');


var campgrounds=[
    {name: "Salmon Creek",image: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"},
    {name: "Granite Hill",image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80"},
    {name: "Mountain Goat's Rest",image: "https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"}
];

//tell app to use body-parser
app.use(bodyParser.urlencoded({extended: true}));

//set up the view engine as ejs
app.set("view engine","ejs");

//set up the home route
app.get('/',function(req,res){

    res.render('landing');

});

//add the show campgrounds route
app.get('/campgrounds',(req,res)=>{     
    

    res.render("campgrounds",{campgrounds: campgrounds});

});


//setup the add campgrounds route
app.post('/campgrounds',function(req,res){
    var name=req.body.name;
    var image=req.body.image;
    var newCampground={name : name, image : image};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});


//create a form for posting a new campground
app.get('/campgrounds/new',(req,res)=>{
    res.render("new");
});





//set up the server
app.listen(3000,function(){
    console.log("YelpCamp Server started!");
});