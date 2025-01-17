import { Order } from "../models/Order.js";
import { Payment } from "../models/Payment.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import {instance} from "../server.js";
import crypto from "crypto";


export const placeOrder = async (req,res,next)=>{
    try{
        const {
            shippingInfo,orderItems,paymentMethod,itemPrice,taxPrice,deliveryCharges,totalAmount,user
        } = req.body;

        // const user = req.user._id;
    
        const orderOptions = {
            shippingInfo,orderItems,paymentMethod,itemPrice,taxPrice,deliveryCharges,totalAmount,user,
        };
        
        await Order.create(orderOptions);

        res.status(201).json({
            success: true,
            message: "Order Placed Successfully via Cash On Delivery",
        });
    }
    catch(error){
        return next(new ErrorHandler("Invalid Order Details",404));
    }
}


export const placeOrderOnline = async (req,res,next)=>{
    try{
        const {
            shippingInfo,orderItems,paymentMethod,itemPrice,taxPrice,deliveryCharges,totalAmount,user
        } = req.body;

        // const user = req.user._id;
        
        const orderOptions = {
            shippingInfo,orderItems,paymentMethod,itemPrice,taxPrice,deliveryCharges,totalAmount,user,
        };

        var options = {
            amount: Number(totalAmount)*100,  // amount in the smallest currency unit
            currency: "INR",
        };
        const order = await instance.orders.create(options);

        await Order.create(orderOptions);

        res.status(201).json({
            success: true,
            order,
            orderOptions,
        });
    }
    catch(error){
        return next(new ErrorHandler("Invalid Order Details",404));
    }
}


export const paymentVerification = async(req,res,next)=>{
    try{
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            orderOptions} = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto.createHmac("sha256",process.env.RAZORPAY_API_SECRET).update(body).digest("hex");

        const isAuthentic = razorpay_signature === expectedSignature;

        if(isAuthentic){
            const payment = await Payment.create({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
            });

            await Order.create({
                ...orderOptions,
                paidAt: new Date(Date.now()),
                paymentInfo: payment._id, 
            });

            res.status(201).json({
                success:true,
                message: `Order Placed Successfully. Payment ID: ${payment._id}`,
            })
        }
        else{
            return next(new ErrorHandler("Payment Failed",400));
        }

    }
    catch(error){
        return next(new ErrorHandler("Payment Failed",400));
    }
}

export const getMyOrders = async (req,res,next)=>{
    try{

        const {user} = req.body;

        const orders = await Order.find({
            user:user._id,
        }).populate("user","name");

        res.status(200).json({
            success:true,
            orders,
        });
    }
    catch(error){
        return next(new ErrorHandler("Not Logged In",404));
    }
}

export const getOrdersDetails = async (req,res,next)=>{
    try{

        const {id} = req.body;

        const order = await Order.findById(id).populate("user","name");

        if(!order){
            return next(new ErrorHandler("Invalid Order Id",404));
        }

        res.status(200).json({
            success:true,
            order,
        });
    }
    catch(error){
        return next(new ErrorHandler("Invalid Order Id",404));
    }
}

export const getAdminOrders = async (req,res,next)=>{
    try{
        const orders = await Order.find().populate("user","name");
        // const orders = await Order.find();

        res.status(200).json({
            success:true,
            orders,
        });
    }
    catch(error){
        return next(new ErrorHandler("Internal Server Error",404));
    }
}

export const processOrder = async (req,res,next)=>{
    try{

        const {id} = req.body;

        const order = await Order.findById(id);

        if(!order){
            return next(new ErrorHandler("Invalid Order Id",404));
        }

        if(order.orderStatus === "Preparing"){
            order.orderStatus = "Shipped";
        }
        else if(order.orderStatus === "Shipped"){
            order.orderStatus = "Delivered";
            order.deliveredAt = new Date(Date.now());
        }
        else if(order.orderStatus === "Delivered"){
            return next(new ErrorHandler("Food Already Delivered",400));
        }

        await order.save();

        res.status(200).json({
            success:true,
            message:"Status Updated Successfully"
        });
    }
    catch(error){
        return next(new ErrorHandler("Invalid Order Id",404));
    }
}