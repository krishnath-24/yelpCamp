var express=require('express');
const app=express();
const bodyParser =require('body-parser');


var campgrounds=[
    {name: "Salmon Creek",image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name: "Granite Hill",image: "https://images.unsplash.com/photo-1537565266759-34bbc16be345?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name: "Mountain Goat's Rest",image: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name: "Mountain Goat's Rest",image: "https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name: "Salmon Creek",image: "https://images.unsplash.com/photo-1559521783-1d1599583485?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name: "Granite Hill",image: "https://images.unsplash.com/photo-1466220549276-aef9ce186540?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name: "Mountain Goat's Rest",image: "https://images.unsplash.com/photo-1466220549276-aef9ce186540?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"},
    {name: "Mountain Goat's Rest",image: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"}

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