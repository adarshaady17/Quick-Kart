import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const registration=async(req,res)=>{
    try{
        const{name,email,phone,password,role}=req.body;
        if(!name||!email||!phone||!password||!role){
            return res.status(400).json({
                message:"Something is missing",
                success:false,
            });
        };
        const user=await User.findOne({email});
        if(user){
            return res.status(400).json({
                message:"User is Already exits",
                success:false,
            });
        }
        const hashedPassword=await bcrypt.hash(password,10);
        await User.create({
            name,
            email,
            phone,
            password:hashedPassword,
            role,
        });
        return res.status(201).json({
            message:"Account create successfully",
            success:true,
        });
    }catch(error){
        console.log(error);
    };
};

export const login=async(req,res)=>{
    try{
        const {email,password,role}=req.body;
        if(!email||!password||!role){
            return res.status(400).json({
                message:"Something is missing",
                success:false
            });
        };
        let user=await User.findOne({email});
        const isPasswordMatch=await bcrypt.compare(password,user.password);

        if(!user || !isPasswordMatch){
            return res.status(400).json({
                message:"Incorrect email or password",
                success:false,
            });
        }

        if(role!==user.role){
            return res.status(400).json({
                massage:"Account doesn't exist with current role",
                return:false,
            });
        }

        const tokenData={userId:user._id};
        const token=jwt.sign(tokenData,process.env.SECRET_KEY,{
            expiresIn:"1d",
        });

        user={
            _id:user._id,
            fullname:user.name,
            email:user.email,
            phone:user.email,
            role:user.role,
        }

        return res.status(200).cookie("token",token,{
            maxAge:1*24*60*60*1000,
            httpsOnly:true,
            sameSite:"strict",
        }).json({
            message:`Welcome back ${user.fullname}`,
            user,
            success:true,
        });
    }catch(error){
        console.log(error);
    }
};

export const logout=async(req,res)=>{
    try{
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"Logged out successfully",
            success:true,
        })
    }catch(error){
        console.log(error);
    }
}
