var express=require("express");
var router=express.Router({mergeParams:true});
var campground=require("../models/campground");
var comment=require("../models/comments");
var middleware=require("../middleware");
router.get("/new",middleware.isLoggedIn,function(req,res){
     campground.findById(req.params.id).populate("comments").exec(function(err,body){
         if(err){
             res.redirect("/campground/:id");
         }else{
             res.render("comments/new",{campground:body});
         }
     });
});

router.post("/",middleware.isLoggedIn,function(req,res){
    
           campground.findById(req.params.id,function(err,curcampground){
             if(err){
                 console.log(err);
                 res.redirect("/campground/"+req.params.id);
             }else{
                 comment.create(req.body.comment,function(err,newcmnt){
                     if(err){
                         console.log(err);
                         res.redirect("/campground/"+req.params.id);
                     }else{
                         newcmnt.author.id=req.user._id;
                         newcmnt.author.username=req.user.username;
                         newcmnt.save();
                         curcampground.comments.push(newcmnt);
                         curcampground.save();
                         res.redirect("/campground/"+req.params.id);
                     }
                 });
             }
    });
});

router.get("/:commentid/edit",middleware.iscreator,function(req,res){
    comment.findById(req.params.commentid,function(err,body){
       if(err){
           res.send("error");
       }else{
           res.render("comments/edit",{campgroundid:req.params.id,comment:body});
       }
    });
});

router.put("/:commentid",middleware.iscreator,function(req,res){
   comment.findByIdAndUpdate(req.params.commentid,req.body.comment,function(err,newcmnt){
      if(err){
          res.redirect("back");
      }else{
          res.redirect("/campground/"+req.params.id);
      }
   });
});

router.delete("/:commentid",middleware.iscreator,function(req,res){
   comment.findByIdAndRemove(req.params.commentid,function(err){
       if(err){
           res.redirect("back");
       }else{
           res.redirect("/campground/"+req.params.id);
       }
   });
});



module.exports=router;