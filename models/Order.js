import mongoose from "mongoose";

const schema = new mongoose.Schema({
    shippingInfo:{
        hNo:{
            type: String,
            required:true,
        },
        address:{
            type: String,
            required: true,
        },
        pinCode:{
            type: Number,
            required:true,
        },
        phoneNo:{
            type: Number,
            required:true,
        },
    },
    orderItems:{
        biryani:{
            price:{
                type: Number,
                required:true,
            },
            quantity:{
                type:Number,
                required:true,
            },
        },
        pizza:{
            price:{
                type: Number,
                required:true,
            },
            quantity:{
                type:Number,
                required:true,
            }
        },
        burger:{
            price:{
                type: Number,
                required:true,
            },
            quantity:{
                type:Number,
                required:true,
            }
        },
        daalMakhni:{
            price:{
                type: Number,
                required:true,
            },
            quantity:{
                type:Number,
                required:true,
            }
        },
        shahiPaneer:{
            price:{
                type: Number,
                required:true,
            },
            quantity:{
                type:Number,
                required:true,
            }
        },
        butterNaan:{
            price:{
                type: Number,
                required:true,
            },
            quantity:{
                type:Number,
                required:true,
            }
        },
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref:"User",
    },
    paymentMethod:{
        type:String,
        enum:["Cash On Delivery","Online"],
        default:"Cash On Delivery",
    },
    paymentInfo:{
        type: String,
    },
    // paidAt:Date,
    paidAt:{
        type:String, 
        // Date,
    },
    itemPrice:{
        type: Number,
        default:0,
    },
    taxPrice:{
        type: Number,
        default:0,
    },
    deliveryCharges:{
        type: Number,
        default:0,
    },
    totalAmount:{
        type: Number,
        default:0,
    },
    orderStatus:{
        type: String,
        enum:["Preparing","Shipped","Delivered"],
        default:"Preparing",
    },
    // deliveredAt:Date,
    deliveredAt:{
        type:String,
    },
});


export const Order = mongoose.model("Order",schema);