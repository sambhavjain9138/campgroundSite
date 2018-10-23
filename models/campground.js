var mongoose=require("mongoose");

var newcmp=new mongoose.Schema({
    name:String,
    img:String,
    description:String,
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        },
        username:String
    },
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
         ref: "comment"
    }]
});

module.exports=mongoose.model("campground",newcmp);