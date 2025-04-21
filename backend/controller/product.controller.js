import Product from "../models/product";
import {v2 as cloudinary} from "cloudinary";

export const addProduct=async(req,res)=>{
    try{
        const {name,description,price,offerPrice}=req.body;
        if(!name||!description||!price||!offerPrice){
            return res.status(400).json({
                message:"Something is missing",
                success:false
            })
        }

        const images=req.files
        let imagesUrl=await Promise.all(
            images.map(async(item)=>{
                let result=await cloudinary.uploader.upload(
                    item.path,{resource_type:'image'}
                );
                return result.secure_url
            })
        )

        await Product.create({
            name,
            description,
            price,
            offerPrice,
            image:imagesUrl,
            category,
            inStock,
        });
        return res.status(201).json({
            message:"Account create successfully",
            success:true
        })

    }catch(error){
        console.log(error);
    }
}

export const productList=async(req,res)=>{
    try{
        const products=await Product.find({});
        if(!products){
            return res.status(404).json({
                message:"Products not found",
                success:false,
            });
        };
        return res.status(200).json({
            products,
            success:true,
        });
    }catch(error){
        console.log(error);
    }
}

export const productById=async(req,res)=>{
    try{
        const {id}=req.body;
        const product=await Product.findById(id);
        if(!product){
            return res.status(400).json({
                message:"Product not found",
                success:false,
            })
        }
        return res.status(200).json({
            product,
            success:true,
        });
    }catch(error){
        console.log(error);
    }
}

export const changeStock=async(req,res)=>{
    try{
        const {id,inStock}=req.body;
        await Product.findByIdAndUpdate(id,{inStock});
        return res.status(200).json({
            message:"stock Updated",
            success:true,
        })
    }catch(error){
        console.log(error);
    }
}