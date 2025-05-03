import User from "../models/user.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const registration = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      if (!name || !email || !password) {
        return res.status(500).json({
          message: "Something is missing",
          success: false,
        }); 
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(200).json({
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
  

  export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.json({
          success: false,
          message: "Please fill all the fields",
        });
      }
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.json({ success: false, message: "User not found" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.json({ success: false, message: "Invalid Password" });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
        expiresIn: "7d",
      });
  
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      return res.json({
        success: true,
        message: "User registered successfully",
        user: { email: user.email, name: user.name },
      });
    } catch (error) {
      console.log(error.message);
      res.json({ success: false, message: error.message });
    }
  };
  
  export const isAuth = async (req, res) => {
    try {
      const { id: userId } = req.user; 
  
      if (!userId) {
          return res.json({ success: false, message: "Unauthorized" });
      }
      const user = await User.findById(userId).select("-password ");
  
      return res.json({ success: true, user });
    } catch (error) {
      console.log(error.message);
      res.json({ success: false, message: error.message });
    }
  };
  
  export const logout = async (req, res) => {
    try {
    
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/",
  
      });
  
      return res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      console.log(error.message);
      res.json({ success: false, message: error.message });
    }
  };
  