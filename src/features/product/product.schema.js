import mongoose from "mongoose";

export const productSchema=new mongoose.Schema({

    name:String,
    price:Number,
    category:String,
    description:String,
    inStock:Number,
    //one product can have multiple reviews
    //so we will have a collection of reviews , thats why a array
    reviews:[
        {
            //now this will refer to the object id of review collection
            type:mongoose.Schema.Types.ObjectId,
            ref:'Review'
        }

    ],
    categories:[
        {
            //now this will refer to the object id of review collection
            type:mongoose.Schema.Types.ObjectId,
            ref:'Category'
        }

    ]

})