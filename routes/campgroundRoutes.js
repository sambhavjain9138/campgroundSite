var express=require("express");
var router=express.Router({mergeParams:true});
var campground=require("../models/campground");
var comment=require("../models/comments");
var middleware=require("../middleware");
router.get("/",function(req,res){
        campground.find({},function(err,campsite){
        if(!err)
        {
             res.render("campground/index",{data:campsite});
        }
    });
});

router.post("/",middleware.isLoggedIn,function(req,res){
    campground.create(req.body.campground,function(err,body){
        if(err){
            res.redirect("/campground/new");
        }else{
            body.author.id=req.user._id;
            body.author.username=req.user.username;
            body.save(function(err,site){
                if(!err)
                {
                    res.redirect("/campground");
                }
            });
        }
    });
    
});

router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campground/new");
});

router.get("/:id/edit",middleware.owner,function(req,res){
    campground.findById(req.params.id,function(err,campground){
                   res.render("campground/edit",{campground:campground});
        });
});

router.put("/:id",middleware.owner,function(req,res){
   campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,body){
       if(err){
           res.redirect("/campground/"+req.params.id+"/edit");
       }else{
           res.redirect("/campground/"+req.params.id);
       }
   });
});

router.delete("/:id",middleware.owner,function(req,res){
   campground.findByIdAndRemove(req.params.id,function(err){
       if(err){
           res.redirect("/campground/"+req.params.id);
       }else{
           res.redirect("/campground");
       }
   }) ;
});

router.get("/:id",function(req,res){
    campground.findById(req.params.id).populate("comments").exec(function(err,body){
        if(!err)
        {
            console.log(body);
            res.render("campground/show",{campground:body});
        }else{
            console.log(err);
        }
    });
});


module.exports=router;