import mongoose from "mongoose";

const ProductSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        description:{
            type:String,
        },
        price:{
            type:Number,
            required:true
        },
        offerPrice:{
            type:Number,
            required:true
        },
        image:{
            type:Array,
            required:true
        },
        category:{
            type:Array,
            required:true
        },
        inStock:{
            type:Boolean,
            default:true
        }
    },{
        timestamps:true
    }
)

const Product=mongoose.models.product || mongoose.model('product',ProductSchema);
export default Product;