
import mongoose from "mongoose";
import dotenv from "dotenv";
import { categorySchema } from "../features/product/category.schema.js";

dotenv.config();
const url=process.env.DB_URL;

export const connectUsingMongoose=async()=>{
    //now the connect function will return us a promise
    try {
        await mongoose.connect(url,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        });
        console.log("MonGODB connected using Mongoose");
        addCategories();
    } catch (error) {
        console.log("error while connecting DB")
        console.log(error)
    }
}

async function addCategories(){
    const CategoryModel=mongoose.model("Category",categorySchema);
    //now we check if there are any category already
    const categories=CategoryModel.find();
    if(!categories || (await categories).length==0){
        await CategoryModel.insertMany([{name:'Books'},{name:'clothing'},
        {name:'Electronics'}])

    }
    console.log('categories added');
}