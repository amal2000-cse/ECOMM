import mongoose from "mongoose";

export const categorySchema=new mongoose.Schema({

    name:String,
    //one category can have multiple products
    products:[
        {
            type:mongoose.Schema.Types.ObjectId,
            //and this will have reference of product collection
            ref:'Product'
        }
    ]
})