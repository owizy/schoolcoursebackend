import mongoose from "mongoose";

const ProfileSchema=mongoose.Schema({
    userId:{type:String},
    image:{type:String}
})

export const ProfileModel = mongoose.model("profilepicture",ProfileSchema) 