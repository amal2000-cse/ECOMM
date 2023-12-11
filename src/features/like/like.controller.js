import { LikeRepository } from "./like.repository.js";

export class LikeController{
    constructor(){
        this.likeRepository=new LikeRepository();
    }

    async likeItem(req,res){
        try {
            const{id,type}=req.body;
            if(type!='Product' && type!='Category'){
                res.status(400).send('Invalid');
            }
            if(type=='Product'){
                await this.likeRepository.likeProduct(req.userID,id);
            }else{
                await this.likeRepository.likeCategory(req.userID,id);
            }
        } catch (error) {
            console.log(error);
            return res.status(200).send("something went wrong");
        }
        res.status(200).send();
    }

    async getLikes(req,res,next){
        try {
            const {id,type}=req.query;
            const likes=await this.likeRepository.getLike(type,id);
            return res.status(200).send(likes);

            
        } catch (error) {
            console.log(error);
            return res.status(200).send("something went wrong");
   
        }
    }

}