var express=require("express");
var mongoose=require("mongoose");
var bodyParser=require("body-parser");
var campground=require("./models/campground");
var comment=require("./models/comments");
var seedDB=require("./seeds"),
    user=require("./models/user"),
    passport=require("passport"),
    flash=require("connect-flash"),
    methodOverride=require("method-override"),
    localStrategy=require("passport-local"),
    sanitizer=require("express-sanitizer");
var authRoutes=require("./routes/authRoutes"),
    campgroundRoutes=require("./routes/campgroundRoutes"),
    commentRoutes=require("./routes/commentRoutes");
mongoose.connect('mongodb://localhost:27017/yelpcamp', { useNewUrlParser: true });
var app=express();


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
///AUTHENTICATION PART
app.use(require("express-session")({
    secret:"i dont have secrets :)",
    resave:false,
    saveUninitialized:false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use(function(req,res,next){
   res.locals.currentuser=req.user;
   res.locals.message=req.flash("error");
   return next();
});

// seedDB(); removes all campgrounds
app.use("/",authRoutes);
app.use("/campground/:id/comments",commentRoutes);
app.use("/campground",campgroundRoutes);

// campground.create({
//     name:"Spiti Valley, Himachal Pradesh",
//     img:"https://www.indianholiday.com/blog/wp-content/uploads/2014/12/Lahual-spiti.jpg"
// },function(err,body){
//     if(!err)
//     {
//         console.log(body);
//     }
// });

// var campgrounds=[{
//     name:"Rishikesh, Uttarakhand",img:"https://www.indianholiday.com/blog/wp-content/uploads/2014/06/Camping-in-Rishikesh.jpg,description:""
// },{
//     name:"Spiti Valley, Himachal Pradesh",img:"https://www.indianholiday.com/blog/wp-content/uploads/2014/12/Lahual-spiti.jpg"
// },{
//     name:"Jaisalmer, Rajasthan",img:"https://www.indianholiday.com/blog/wp-content/uploads/2014/06/Camping-in-Jaisalmer.jpg"
// },{
//     name:"Chandertal Lake,Himachal Pradesh",img:"https://www.indianholiday.com/blog/wp-content/uploads/2014/06/camping-at-Chandertal-Lake.jpg"
// },{
//     name:"Manali Solang Valley – Himachal Pradesh",img:"https://www.indianholiday.com/blog/wp-content/uploads/2014/06/Camping-in-manali.jpg"
// },{
//     name:"Mussoorie, Uttarakhand",img:"https://www.indianholiday.com/blog/wp-content/uploads/2014/06/camping-in-Mussorie.jpg"
// },{
//     name:"Pushkar, Rajasthan",img:"https://www.indianholiday.com/blog/wp-content/uploads/2014/06/camping-in-pushkar.jpg"
// },{
//     name:"Sonamarg, Jammu and Kashmir",img:"https://www.indianholiday.com/blog/wp-content/uploads/2014/06/camping-in-Sonamarg.jpg"
// },{
//     name:"Anjuna, Goa",img:"https://www.indianholiday.com/blog/wp-content/uploads/2014/06/camping-at-anjuna-beach.jpg"
// },{
//     name:"Kaudiyala – Uttaranchal",img:"https://www.indianholiday.com/blog/wp-content/uploads/2014/06/camping-in-Kaudilya.jpg"
// }];


app.listen(process.env.PORT,process.env.IP,function(){
   console.log("camp site server on"); 
});
