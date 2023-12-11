import UserModel from './user.model.js';
import jwt from 'jsonwebtoken';
import UserRepository from './user.repository.js';
import bcrypt from 'bcrypt';

export default class UserController {

  constructor(){
    this.userRepository = new UserRepository();
  }

  async resetPassword(req,res,next){
    const {newPassword}=req.body;
    const hashedPassword= await bcrypt.hash(newPassword,12);
    const userID=req.userID;
    try {

      await this.userRepository.resetPassword(userID,hashedPassword);
      res.status(200).send("Password successfully reseted")
      
    } catch (error) {
      console.log(error);
      console.log("passing error to middlwware");
      next(error);
    }

  }


  async signUp(req, res,next) {
    const {
      name,
      email,
      password,
      type,
    } = req.body;

    //before adding the user provided password and making into the object with the userModel
    // we will hash the password, so no one will be able to break the password
    //this bcrypt is a asychrous function so we need to add await
   
    try{
    const hashedPassword= await bcrypt.hash(password,12);
    const user = new UserModel(
      name,
      email,
      hashedPassword,
      //password,
      type
    );
    await this.userRepository.signUp(user);
    res.status(201).send(user);
  }catch(err){
    next(err);
  }
}

  async signIn(req, res,next) {

    try{

      //1. finding the user by email
      const user=await this.userRepository.findByEmail(req.body.email);
      if(!user){
        return res
        .status(400)
        .send('Incorrect Credentials');
      }
      else{
        //2
        //now if we have found the user based on the email
        //then now we will compaire their plain text password- which the user is providing now
        // and getting the password which is saved in the memory and decrypting it
        // and compaireing both of them
         // the compaire function in bcrypt will return us true or false
         // if its true then its correct
         //we will add await as this is a asynchronous function
         const result=await bcrypt.compare(req.body.password,user.password);
         if(result){
          //3.if the result is true, we are returning the token
          const token = jwt.sign(
            {
              userID: user._id,
              email: user.email,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: '1h',
            }
          );
    
          // 4. Send token.
          return res.status(200).send(token);
         }
         else{
          return res
          .status(400)
          .send('Incorrect Credentials');
         }
      }
  }
  catch(err){
    console.log(err);
    return res.status(400).send("something went wrong");
  }
}
}
