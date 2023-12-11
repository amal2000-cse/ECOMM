import mongoose from "mongoose";

export const likeSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    likeable:{
        //here this object can be a id for product
        // or an id for the category
        type:mongoose.Schema.Types.ObjectId,
        //this will specify which type of objects can appear here
        refPath:'on_model'
    },
    //this on_model has to match with the refPath which we gave above
    on_model:{
        type:String,
        //so now with the help of enum we can restrict only the use of those
        //whose name is in the enum
        enum:['Product','Category']

    }
    
})