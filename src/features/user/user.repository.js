// this new repository will handle all the operation in mongodb using mongoose
import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
//first we need to get the model
// so here we are creating model from schema
const UserModel=mongoose.model('User',userSchema); //this take two parameter name and schema

export default class UserRepository{

    async resetPassword(userID, hashedPassword){
        try{
            let user = await UserModel.findById(userID);
            if(user){
                user.password=hashedPassword;
                user.save();
            }else{
                throw new Error("No such user found");
            }
            
        } catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);
        }
    }

    async signUp(user){
       try {
         //create instance of model
         const newUser=new UserModel(user); //so here we will pass whatever data we recived from the controller
         await newUser.save(); //save function will save the document
         return newUser;
 
       } catch (error) {
        console.log(error);
        //now here we can show if the error is from mongoose validation error
       //so now to show the error if the email or password is not correct is to 
       //now we check if the error we are receiving in an 
       //instance of mooogose.Error.validationError
       if(error instanceof mongoose.Error.ValidationError){
          throw error;
       }else{
        console.log(error);
        throw new ApplicationError("something went wrong with database",500);
    
       }

          }
    }
    async signIn(email,password){
        try {
            //we can use the findOne function to find the email and password
            return await UserModel.findOne({email,password});
            
    
          } catch (error) {
           console.log(error);
           throw new ApplicationError("something went wrong with database",500);
          }
    }

    async findByEmail(email) {
        try{
        
        return await UserModel.findOne({email});
        } catch(err){
            console.log(err);
          throw new ApplicationError("Something went wrong with the database", 500);
        }
      }
}