import ErrorHandler from "../utils/ErrorHandler.js";
import {User} from "../models/User.js";
import {Order} from "../models/Order.js";
import { Contact } from "../models/Contact.js";

export const myProfile = (req,res,next)=>{
    res.status(200).json({
        success:true,
        user: req.user,
    });
}

export const logout = (req,res,next)=>{
    req.session.destroy((err)=>{
        if(err){
            // return next(err);
            return next(new ErrorHandler("Internal Error",404));
        }
        res.clearCookie("connect.sid");
        res.status(200).json({
            message:"Logged Out",
        });
    });
};

export const getAdminUsers = async (req,res,next)=>{
    try{
        const users = await User.find();

        res.status(200).json({
            success:true,
            users,
        })
    }
    catch(error){
        return next(new ErrorHandler(error,401));
    }
}

export const getAdminStats = async (req,res,next)=>{
    try{
        const usersCount = await User.countDocuments();
        const ordersCount = await Order.countDocuments();

        let totalIncome = 0;
        
        const orders = await Order.find();

        orders.forEach((i)=>{
            totalIncome += i.totalAmount;
        });

        res.status(200).json({
            success:true,
            usersCount,
            ordersCount,
            totalIncome,
        });
    }
    catch(error){
        return next(new ErrorHandler(error,401));
    }
}

export const contact = async (req,res,next)=>{
    try {
        const {user,name,email,userMessage} = req.body;

        const contactDetails = {user,name,email,userMessage};

        await Contact.create(contactDetails);

        res.status(201).json({
            success: true,
            message: "Message Sent Successfully",
        });

    } catch (error) {
        return next(new ErrorHandler(error,401));
    }
}