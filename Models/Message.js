import mongoose from "mongoose";

const MessageSchema = mongoose.Schema({
    conversationId:{type:String},
    senderId:{type:String},
    message:{type:String}
},{
    timestamps:true,
})


const MessageModel = mongoose.model("messages",MessageSchema)

export default MessageModel