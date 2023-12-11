import {ObjectId} from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js";

//now we have to create a new model as now we are working with mongoose
//which will takw 2 parameter: 1) name of our collection (Product)
                             //2) and from which schema it come from
const productModel=mongoose.model("Product",productSchema);
//then we will have a review model
const ReviewModel=mongoose.model("Review",reviewSchema);
//now we will make changes in the rate function below

const CategoryModel=mongoose.model("Category",categorySchema);

class ProductRepository{

    constructor(){
        this.collection="products";
    }

    async add(productData){
        try{
            //the categories that we are sending from the post man is not in  the form of a array
            //so they are not pushed into tthe category array in the category schema
            //so first we need to convert that in a array
            //and we can use split for that
            productData.categories=productData.category.split(',');
            console.log(productData);



            //now here we want to make some changes so that we will be able to 
            //use many to many over here
            const newProduct=new productModel(productData);
            const savedProduct=await newProduct.save();
            //we are expecting the category ID's as a array in the productData

            //2. now we need to update the categories
            //there are two parameter - which all document we want to update(filter)
            //and what exactly are we updating
            CategoryModel.updateMany(
                //basically $in operation will work with an array
            //it will update all the categories for which id is in this array
               //this is how we are going to filter using $in
                {_id:{$in:productData.categories}},
                //now we have to update the products array in the category document
                //and we use $push operation
                //we are pushing the new category id
                //in push we are updating the products array
                //and in products array we are adding a new entry
                //which will the object ID of savedProduct of id
                {$push:{products:new ObjectId(savedProduct._id)}}
            )

        }catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong in the product database",500);
        }
    }

    async getAll(){
        try{

            const db=getDB();
            const collection=db.collection(this.collection);
            return await collection.find().toArray();

        }catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong in the product database",500);
        }

    }

    async get(id){
        try{

            const db=getDB();
            const collection=db.collection(this.collection);
            //here when we are passing a id to the find funciton
            // mongodb is expecting a object id
            // so to convert that into a object id we use- ObjectId(id)
            return await collection.findOne({_id:new ObjectId(id)});

        }catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong in the product database",500);
        }
    }

    // a product should have min price specified and category
    async filter(minPrice,categories){
        try{
            const db=getDB();
            const collection=db.collection(this.collection);
            let filterExpression={};
            //if we use three if loops simultaneously
            //after one if condition, the next if is appending over the before the previous if and overwritting the before ifs conditions
            // so to resolve that we are use ...filterExpression.price to get all the existing content
            //so with this instead of overwriting, it will extend it
            
            if(minPrice){
                filterExpression.price={$gte:parseFloat(minPrice)}
            }
            // if(maxPrice){
            //     filterExpression.price={...filterExpression.price,$lte:parseFloat(maxPrice)}
            // }

            /// now we are trying to merge the condition for minPrice and category together

            if(categories){
                // $and expression takes in a array of expressions
                //multiple expression added together , and "AND"operations in applied
               // filterExpression={$and:[{category:category},filterExpression]}

               // $or operation - if it satify any one condition then it will return it
               categories=JSON.parse(categories.replace(/'/g,'"'));
               console.log(categories);
               filterExpression={$or:[{category:{$in:categories}},filterExpression]}

             //   filterExpression.category=category;
            }
           // return collection.find(filterExpression).toArray();
           //if i want to return specific attributes to be returned like name and price
           return collection.find(filterExpression).project({name:1,price:1,_id:0,ratings:{$slice:1}}).toArray();


        }catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong in the product database",500); 
        }
    }

    async rate(userID,productID,rating){
        try{
            // const db=getDB();
            // const collection=db.collection(this.collection);

        //     //first we will check if there is any previous rating for this product
        //     // if not we will add a new rating to it

        //     //1. first step is to find the product
        //     const product=await collection.findOne({_id:new ObjectId(productID)});
        //     //2. second is to find the rating

        //     const userRating=product?.ratings?.find(r=>r.userID==userID)
        //    if(userRating){
        //     //3. if user id is there we need to update the rating
        //     await collection.updateOne({
        //         _id:new ObjectId(productID), "rating.userID": new ObjectId(userID)
        //     },{
        //         $set:{
        //             "rating.$.rating":rating
        //         }
        //     })
        //    }else{
            //4. if there is no rating , we create a new rating

            //--------------------------------------
            // new approach - instead of find the rating array and updating it

            // we will just remove the before rating and add a new one
            //1.removes the existing entry
            // await collection.updateOne({
            //     _id:new ObjectId(productID)
            // },
            // {
            //     //now here we remove before rating
            //     $pull:{ratings:{userID:new ObjectId(userID)}}
            // })
            // //2. now the before rating is removed and the new rating being pushed here
            // await collection.updateOne({
            //     _id:new ObjectId(productID)
            // },{
            //     $push:{ratings:{userID:new ObjectId(userID),rating}}
            // })
          // }


          //----------------------------------
          // now writing new code which uses mongoose as schema
          //this is the example of one to many relation ship
          //where one product have multiple reviews

          //1. first we need to check if product exists
          const productToUpdate=await productModel.findById(productID);
          if(!productToUpdate){
            throw new Error("Product not found");
          }
          //2. find existing review
          // we need to find the review based on the product and the user
          const userReview=await ReviewModel.findOne({product:new ObjectId(productID),user:new ObjectId(userID)});
          //if user has already given a review we just neeed to update that reviwe
          if(userReview){
            userReview.rating=rating;
           await userReview.save();
          }else{
            const newReview= new ReviewModel({
                product:new ObjectId(productID),
                user:new ObjectId(userID),
                rating:rating
            });
             newReview.save();
          }


        }catch(err){
            console.log(err);
            throw new ApplicationError("something went wrong in the product database",500); 
    
        }

    }

    async averageProductPricePerCategory(){
        try {
            const db=getDB();
            //we have to create these types of tempory fields
            // {_id:cat1. averagePrice:50000} like this temporary fields - with the help of aggregation pipeline
            // so there will be a array of stages for this aggregate function
            return await db.collection(this.collection)
                  .aggregate([
                    {
                       //stage 1: GET average price per category
                       $group:{
                        //every group will have a group id
                        // here we can use each category as each group id - so if 3 category then we will have 3 group
                           _id:"$category",
                           averagePrice:{$avg:"$price"}
                       }
                    }
                    
                    //so this aggregate will return us multiple objects
                    // so we are converting all into one array
                  ]).toArray();

        } catch (error) {
            console.log(error);
            throw new ApplicationError("something went wrong in the product database",500); 
        }
    }




    // //method to get the averge rating of a particular product
    // db.products.aggregate([
    //     //1. create documents for ratings
    //     {
    //         $unwind:"$rating"
    //     },

    //     //2. group rating per product and get average
    //     {
    //         $group:{
    //             _id:"$name",
    //             averageRating:($avg:"$ratings.rating")
    //         }
    //     }
    // ])


    //method to get the count of rating of a particular product

    // db.products.aggregate([
    //     //1. project name of product ,and countOfRating
    //     {
    //         $project:{name:1,countOfRating:{
    //             $cond:{if:{$isArray:"$ratings"}
    //             ,then:{$size:"$ratings",else:0}}}}
    //     },
    /*
           {
            //stage2: sort the collection
            //-1 means desending
            with this we will be able to get the person with highest rating at the top
            $sort:{countofRating:-1}
           },
               //stage 3
               only getting the first element in the array
               which will the one with the highest rating
               //limit to just 1 item in result

               {
                $limit:1
               }
         
    */ 
    // ])

    //find the product with highest number of rating


}

export default ProductRepository;