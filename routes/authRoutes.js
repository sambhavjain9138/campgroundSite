var express=require("express");
var router=express.Router();
var user=require("../models/user");
var passport=require("passport");

var middleware=require("../middleware");

router.get("/",function(req,res){
   res.render("landing"); 
});

router.get("/register",function(req,res){
    res.render("register");
});

router.post("/register",function(req,res){
    var newuser=new user({
        username:req.body.username
    });
    user.register(newuser,req.body.password,function(err,body){
        if(err){
            console.log(err);
            res.render("register");
        }else{
            passport.authenticate("local")(req,res,function(){
               res.redirect("/campground"); 
            });
        }
    });
});

router.get("/login",function(req,res){
   res.render("login");
});

router.get("/logout",function(req,res){
   req.logout();
   res.redirect("/campground");
});

router.post("/login",passport.authenticate("local",{successRedirect:"/campground",failureRedirect:"/login"}),function(req,res){});

module.exports=router;