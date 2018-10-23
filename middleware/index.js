var campground=require("../models/campground");
var comment=require("../models/comments");

var middleware={
};

middleware.owner=function(req,res,next){
    if(req.isAuthenticated())
    {
        campground.findById(req.params.id,function(err,campground){
           if(err){
               res.redirect("back");
           }else{
               if(campground.author.id.equals(req.user._id)){
                   next();
               }else{
                   req.flash("tera baap ka maal nhi hai");
                   res.redirect("back");
               }
           }
        });
    }else{
        req.flash("error","pehle login toh kr chutiye");
        res.redirect("/login");
    }
};

middleware.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error","pehle login toh kr chutiye");
        res.redirect("/login");
    }
}

middleware.iscreator=function(req,res,next){
    if(req.isAuthenticated())
    {
        comment.findById(req.params.commentid,function(err,cmnt){
           if(err){
               console.log(err);
               res.redirect("back");
           }else{
               if(cmnt.author.id.equals(req.user._id)){
                   next();
               }else{
                   req.flash("tera baap ka maal nhi hai");
                   res.redirect("back");
               }
           }
        });
    }else{
        req.flash("error","pehle login toh kr chutiye");
        console.log("not authenticated");
        res.redirect("/login");
    }
}

module.exports=middleware;