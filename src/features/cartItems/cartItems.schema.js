import mongoose, { Schema } from "mongoose";

export const cartSchema=new Schema({
    // we can specify here that, this is an pbject id which belong to different collection
    productID:{
        type:mongoose.Schema.Types.ObjectId,
        //here we can type which collectionit belong to
        ref:'Product'
    },
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    quantity:Number
}) 