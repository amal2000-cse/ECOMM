
import { MongoClient } from "mongodb";


// If the above url gives error (error may be caused due to IPv4/IPv6 configuration conflict), then try the url given below
// const url = "mongodb://127.0.0.1:27017/ecomdb";

let client;
export const connectToMongoDB = ()=>{
     MongoClient.connect(process.env.DB_URL)
        .then(clientInstance=>{
            client=clientInstance
            console.log("Mongodb is connected");
            createCounter(client.db());
            createIndexes(client.db());
        })
        .catch(err=>{
            console.log(err);
        })
}

//client is the instance of mongodb client
// whcih we receive after we have successfully connected to the database
export const getClient=()=>{
    return client;
}

export const getDB = ()=>{
    return client.db();
}

const createCounter= async(db)=>{
    const existingCounter=await db.collection("counters").findOne({_id:'cartItemId'});
    if(!existingCounter){
        await db.collection("counters").insertOne({_id:'cartItemId',value:0});

    }

}

//creating INDEXES

const createIndexes=async(db)=>{
    try{
        //on products collection - it takes price and if its ascending or descending
        // if ascending its = 1
        // if descending its = -1
        await db.collection("products").createIndex({price:1});

        //now this is for compound index
        await db.collection("products").createIndex({name:1,category:-1});

        //text based index
        //when we have descrptions of our product and we have a feature to search the product by text
        //then we can use this text based index
        await db.collection("products").createIndex({desc:"text"});

    }catch(err){
        console.log(err);
    }
    console.log("Indexes are created");
}