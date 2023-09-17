import UserModel from "../Models/UserModel.js";
import ConversationModel from "../Models/Conversation.js"
import MessageModel from "../Models/Message.js"
const Message=async(req,res)=>{
  try {
    const { conversationId, senderId,receiverId ,message} = req.body;
        console.log("receiverId",receiverId)
        // console.log("senderId",senderId)
        // console.log("conversationId",conversationId)
    if (!senderId ){ return res.status(400).send('Please fill all required fields')}
   else if(conversationId === 'new' && receiverId) {
        const newCoversation = new ConversationModel({ members: [senderId, receiverId] });
        await newCoversation.save();
        // const newMessage = new MessageModel({ conversationId: newCoversation._id, senderId });
        // await newMessage.save();
        return res.status(200).json({conversationId:newCoversation._id});
    } else if (!conversationId && !receiverId) {
        return res.status(400).send('Please fill all required fields')
    }
    const newMessage = new MessageModel({ conversationId, senderId, message });
    await newMessage.save();
    res.status(200).json('message succesful');
} catch (error) {
    console.log(error, 'Error')
}
}

const MessageOne=async(req,res)=>{
    try{
        const conversationId = req.params.conversationId;
      const checkMessages = async (conversationId) => {
        console.log(conversationId, 'conversationId')
        const messages = await MessageModel.find({ conversationId});
        const messageUserData = Promise.all(messages.map(async (message) => {
            const user = await UserModel.findById(message.senderId);
            console.log("mess",message)
            return { user: { id: user._id, email: user.email, fullname: user.fullname }, message: message.message , timestamp:message.createdAt }
        }));
        const messData = await messageUserData 
        res.status(200).json(messData);
    }
    
    if (conversationId === 'new'){
        const checkConversation = await ConversationModel.find({ members: {$all: [req.query.senderId, req.query.receiverId] } });
        if (checkConversation.length > 0) {
            checkMessages(checkConversation[0]._id);
        } else{
            return res.status(200).json([])
        }
    } else {
        checkMessages(conversationId);
    }
}catch(err){
   console.log("error : " + err.message)
   res.status(500).json(err.message)
}
}

export {Message ,MessageOne}