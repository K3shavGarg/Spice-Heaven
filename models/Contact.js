import mongoose from "mongoose";

const schema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.ObjectId,
        ref:"User",
    },
    name:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
    },
    userMessage:{
        type:String,
        required: true,
    }
});

export const Contact = mongoose.model("Contact",schema);