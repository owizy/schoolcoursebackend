import mongoose from "mongoose";


const ConversationSchema = mongoose.Schema({
  members:{
    type:Array,
    required:true
  }

},{
    timestamps:true,
})



const  ConversationModel = mongoose.model("conversation",ConversationSchema)

export  default ConversationModel