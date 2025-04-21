import mongoose from "mongoose";

const UserSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        phone:{
            type: Number,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        role:{
            type:String,
            enum:["admin","user","delivery-agent"],
            required:true
        }
    },{
        timestamps:true,
    }
)
export const User = mongoose.model("User", UserSchema);
