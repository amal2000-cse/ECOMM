import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";


class UserRepository{
  constructor(){
    this.collection="users";
}

     async signUp(newUser) {
        try{
          // 1. Get the database
        const db = getDB();
        // 2. Get the collection
        //in the above we have given this.collection="users";
        const collection = db.collection(this.collection);
        
        // 3. Insert the document.
        await collection.insertOne(newUser);
        return newUser;
        } catch(err){
            console.log(err);
          throw new ApplicationError("Something went wrong with the database", 500);
        }
      }


      async signIn(email,password) {
        try{
          // 1. Get the database
        const db = getDB();
        // 2. Get the collection
        const collection = db.collection(this.collection);
        
        // 3. Find the document.
        //after we found the user, can we return it
        return await collection.findOne({email,password});
        } catch(err){
            console.log(err);
          throw new ApplicationError("Something went wrong with the database", 500);
        }
      }

      async findByEmail(email) {
        try{
          // 1. Get the database
        const db = getDB();
        // 2. Get the collection
        const collection = db.collection("users");
        
        // 3. Find the document.
        //after we found the user, can we return it
        return await collection.findOne({email});
        } catch(err){
            console.log(err);
          throw new ApplicationError("Something went wrong with the database", 500);
        }
      }

}
export default UserRepository;