import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import OrderModel from "./order.model.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class OrderRepository{

    constructor(){
        this.collection="orders";
    }

    async placeOrder(userID){
        //now here we import the client instance from the mongodb.js
        const client=getClient();
        //using this client we will be able to set up a session
        //now we start the session here
        const session=client.startSession();
       try {
        

        const db=getDB();
        session.startTransaction(); //it is a collection of all database operations which must be performed in such a way that
        //either all the operations are executed or none of them is executed

         //1. get cartitems and calculate totalamount
         const items=await this.getTotalAmount(userID,session); //now we are going to pass the sesssion over here
         const finalTotalAmount=items.reduce((acc,item)=>acc+item.totalAmount,0); // and the initial value is zero
         console.log(items);
         console.log(finalTotalAmount)

         //2. create an order record

         const newOrder=new OrderModel(new ObjectId(userID),finalTotalAmount,new Date());
         await db.collection(this.collection).insertOne(newOrder,{session});
 
         //3. reduce the stock
         //now reducing all the stocks inside the products collection (we will use increment and increment it by negative value of the stocks updated so that it will reduce)
         for(let item of items){
            await db.collection("products").updateOne(
                {_id:item.productID},
                {$inc:{stock:-item.quantity}},{session}
            )
         }

         throw new Error("something is wrong in placeholder");
 
         //4. clear the cart items
         await db.collection("cartItems").deleteMany({
            userID:new ObjectId(userID)
         },{session});

         // we also have to end the session
         session.commitTransaction();
         session.endSession();

         return;
       } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.log(error);
        throw new ApplicationError("something went wrong",500);
        
       }

    }

    //getting the totalAmount of the respective user
    async getTotalAmount(userId,session){
        const db=getDB();
        const items= await db.collection("cartItems").aggregate([
            //1. stage 1
            // get cart items for the userID
            //FOR that we have a operation called as match
            {
                $match:{userID:new ObjectId(userId)}  //this will give us alll the cartItems of this user

            },
            //2. stage 2
            //for all those cartItems we need to find the matching  products
            // because in the cartItems it only has the productID of all the product items which the user selected

            //now using the objectID we will be able to find the products using the operator
            //using the operator - lookup
            // as all the collection inside the mongodb is connected with each other, we can retrive each other using the others userId
            //lookup- it performs a left outer join to a collection in the same database to filter in documents from the joined collection for precesssing

            //GET THE PRODCUTS FROM PRODUCTS COLLECTION.

            {
                $lookup:{
                    from:"products",
                    localField:"productID",
                    foreignField:"_id",
                    // as is used to give it a name
                    as:"productInfo"
                }
            },
            //3. Unwind the productInfo
            {
                $unwind:"$productInfo"
            },
            //4. calculate totalAmount for each cartItems
            {
                //now in the cartItems we are adding a field
                $addFields:{
                    "totalAmount":{
                        $multiply:["$productInfo.price","$quantity"]
                    }
                }
            } 
        ],{session}).toArray();
        //now we need to get the sum of all totalItems prices
        return items;
        

    }


}