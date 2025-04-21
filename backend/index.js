import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
//import path from "path";
import cookieParser from "cookie-parser";
import UserRouter from "./routes/user.routes.js";
import connectCloudinary from "./utils/cloudinary.js";

const app=express();
dotenv.config({});
connectDB();
await connectCloudinary();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const corsOpt={
    origin:'http://localhost:5173',
    credentials:true
}

//app.use(cors(corsOpt));

const PORT=process.env.PORT || 5000;

app.use("/api/v1/user",UserRouter);

app.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`);
});


