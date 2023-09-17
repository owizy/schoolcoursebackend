import mongoose from "mongoose";

const MessCreatedSchema=mongoose.Schema({
    userId:{type:String},
    createdChat:{type:String}
})


export const CreatedChat = mongoose.model("createdchat",MessCreatedSchema)