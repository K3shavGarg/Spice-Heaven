import express, { urlencoded } from "express";
import dotenv from "dotenv";
import {connectPassport} from "./utils/Provider.js";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import cors from "cors";

const app = express();
export default app;

dotenv.config({
    path: "./config/config.env",
});

// Using middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use(cookieParser());
app.use(express.json());
app.use(
    urlencoded({
        extended:true,
    })
)

app.use(cors(
    {
        credentials:true,
        origin: "http://localhost:3000",
        methods: ["GET","POST","PUT","DELETE"],
    }
));

app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());

connectPassport();

// Importing routes
import userRoute from "./routes/user.js";
import orderRoute from "./routes/order.js";

app.use("/api/v1",userRoute);
app.use("/api/v1",orderRoute);


// Using error middleware

app.use(errorMiddleware);