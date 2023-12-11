import { likeSchema } from "./like.schema.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { ApplicationError } from "../../error-handler/applicationError.js";

const LikeModel=mongoose.model("Like",likeSchema);
export class LikeRepository{

    async getLike(type,id){
        return await LikeModel.find({
            likeable:new ObjectId(id),
            on_model:type
        }).populate('user')
        .populate({path:'likeable',model:type})
    }

    async likeProduct(userId,productId){
        try {
            const newLike=new LikeModel({
                user:new ObjectId(userId),
                likeable:new ObjectId(productId),
                on_model:'Product'
            });
            await newLike.save();

            
        } catch (error) {
            console.log(error);
            throw new ApplicationError("something went wrong inthe database",500);
        }

    }

    async likeCategory(userId,categoryId){
        try {
            const newLike=new LikeModel({
                user:new ObjectId(userId),
                likeable:new ObjectId(categoryId),
                on_model:'Category'
            });
            await newLike.save();

            
        } catch (error) {
            console.log(error);
            throw new ApplicationError("something went wrong inthe database",500);
        }

    }

}