import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const registration = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      if (!name || !email || !password) {
        return res.status(400).json({
          message: "Something is missing",
          success: false,
        });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "User already exists",
          success: false,
        });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = await User.create({
        name,
        email,
        password: hashedPassword
      });
  
      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: "7d",
      });
  
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
  
      return res.status(201).json({
        message: "Account created successfully",
        success: true,
        user: {
          email: user.email,
          name: user.name
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({
        message: "Server error",
        success: false,
      });
    }
  };
  

export const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email||!password){
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

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
            expiresIn: "7d",
          });
      
          res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });

        return res.json({
            message:`Welcome back ${user.fullname}`,
            user:{email:user.email,name:user.name},
            success:true,
        });
    }catch(error){
        console.log(error);
    }
};

export const isAuth = async (req, res) => {
  try {
    const user = await User.findById(req.id).select("-password");
    return res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const logout=async(req,res)=>{
    try{
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production' ? 'none':'strict',
        });
        return res.json({success:true,message:"Logged Out"});
    }catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}
