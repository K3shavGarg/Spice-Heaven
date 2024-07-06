import  express from "express";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import { getAdminOrders, getMyOrders, getOrdersDetails, paymentVerification, placeOrder, placeOrderOnline, processOrder } from "../controllers/order.js";

const router = express.Router();

router.post("/createorder", isAuthenticated, placeOrder);

router.post("/createorderonline", isAuthenticated, placeOrderOnline);

router.post("/paymentVerification", isAuthenticated, paymentVerification);

router.post("/myorders", isAuthenticated, getMyOrders);

router.post("/order/:id", isAuthenticated, getOrdersDetails);

router.get("/admin/orders", isAuthenticated, authorizeAdmin, getAdminOrders);

router.post("/admin/order/:id", isAuthenticated, authorizeAdmin, processOrder);

export default router;