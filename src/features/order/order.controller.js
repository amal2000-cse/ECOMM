import OrderRepository from "./order.repository.js"

export default class OrderController{
    constructor(){
        this.orderRepository=new OrderRepository();
    }

    async placeOrder(req,res,next){

        try {
            const userId=req.userID;
            await this.orderRepository.placeOrder(userId);
            res.status(201).send("order is created");
            
        } catch (error) {
            console.log(error);
            next(error);
            
        }

    }
}