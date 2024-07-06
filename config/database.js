import mongoose from "mongoose";
// const mongoURI = "mongodb://127.0.0.1:27017/spiceheaven";

export const connectDB = async ()=>{
    const {connection} = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database is connected with ${connection.host}`);
}