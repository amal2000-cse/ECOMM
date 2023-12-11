import {ObjectId} from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class CartItemsRepository{

    constructor(){
        this.collection="cartItems";
    }

    async add(productID,userID,quantity){

       try {
        const db=getDB();
        const collection=db.collection(this.collection);

        //to make the _id more readable in the cartItems - eg: 1,2,3,...
        //we made a function down below named getNextCounter
        const id=await this.getNextCounter(db);  // to make sure that the newily created id should
        //only be used only the insert and not the update and we have another operator we can choose
        //ie: $setOnInsert:{_id:id},

        //find the document 
        //then either insert if the documnent is not present
        // or update if the document is not present
        
        await collection.updateOne(
            //now this will find if the quantity document is already present
            // if document is not present it will also create a new document
            {productID:new ObjectId(productID),userID:new ObjectId(userID)},

            //if its present we will increment the before value with the currrent value
            {
                $setOnInsert:{_id:id},
                $inc:{
                quantity:quantity
            }},
            {upsert:true})
        
       } catch (error) {
        console.log(err);
        throw new ApplicationError("something went wrong in the product database",500);
       }
    }

    async get(userID){
        try {
            const db=getDB();
            const collection=db.collection(this.collection);
            //the below find funcition will return us a cursor
            //and we use toArray to convert that into array
            return await collection.find({userID:new ObjectId(userID)}).toArray();
            
        } catch (error) {
            console.log(err);
            throw new ApplicationError("something went wrong in the product database",500);
   
        }
    }

    async delete(userID,cartItemID){
        try {
            const db=getDB();
            const collection=db.collection(this.collection);
           
             const result=await collection.deleteOne({_id:new ObjectId(cartItemID),userID:new ObjectId(userID)})
            return result.deletedCount>0;
            
        } catch (error) {
            console.log(err);
            throw new ApplicationError("something went wrong in the product database",500);
   
        }
    }

    async getNextCounter(db){
        
        //find and update the data
        //so in the counters collection we are going to find one record and update that
        // thats why we are using findOneAndUpdate
        const resultDocument=await db.collection("counters").findOneAndUpdate(
            //and this will the take the parameters
            //1. is how do we find the counter
            {_id:'cartItemId'},
            //next is to increment the value by one
            {$inc:{value:1}},
            // this findOneAndUpdate will return us the original document
            // but we the document which is the updated document
            //which is after the value is incremented
            {returnDocument:'after'}
        )
        console.log(resultDocument);
        return resultDocument.value;
    }
}