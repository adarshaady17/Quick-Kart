import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
//import path from "path";
import cookieParser from "cookie-parser";
import UserRouter from "./routes/user.routes.js";
import connectCloudinary from "./utils/cloudinary.js";
import cors from "cors";
import SellerRouter from "./routes/seller.routers.js";
import ProductRouter from "./routes/product.routes.js";
import CartRouter from "./routes/cart.router.js";
import AddressRouter from "./routes/address.routes.js";
import OrderRouter from "./routes/order.route.js";

const app=express();
dotenv.config({});
connectDB();
await connectCloudinary();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true,              
}));

const PORT=process.env.PORT || 5000;

app.use("/api/v1/user",UserRouter);
app.use("/api/v1/seller",SellerRouter);
app.use("/api/v1/product",ProductRouter);
app.use("/api/v1/cart",CartRouter);
app.use("/api/v1/address",AddressRouter);
app.use("/api/v1/order",OrderRouter);

app.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`);
});


