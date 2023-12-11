import mongoose from "mongoose";

export const userSchema=new mongoose.Schema({
    //this will help us to create these kinds of validation
    //now adding validation for name

    name:{type:String,maxLength:[25,"Name cannot be more that 25 character"]},
    email:{type:String,unique:true,required:true,
        //now how to check if the email it valid , like if it has @ and . like that
       // match:[/.+\@+\../,"Please enter a valid email"]
    
    }, //with the help of schema we will be able to specify of the email should be string or unique like that
    // it helps in validation of the attribute
    password:{type:String,
        //now adding custom validator
        // validate:{
        //      validator:function(value){
        //     //this will check if it atleast have one special character
        //     //then aplabatic characters and then the number of character it btw 8 to 12
        //     return /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(value)
        // },
        // message:"Password should be between 8-12 character and have a special character"
        // }
    },
    //we can specify what kind of types it can accept
    //we have the predefined values as seller and customer
    // we can specify a array of specified values as enums
    type:{type:String,enum:['Customer','Seller']} //and enum will accept one of these two values
})

