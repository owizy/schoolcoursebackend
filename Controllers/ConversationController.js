import UserModel from "../Models/UserModel.js";
import ConversationModel from "../Models/Conversation.js";
const Conversation =async(req,res)=>{
    try {
        const { senderId, receiverId } = req.body;
        const newCoversation = new ConversationModel({ members: [senderId, receiverId] });
        await newCoversation.save();
        res.status(200).send('Conversation created successfully');
    }catch(err){

   res.status(500).json(err.message) 
}
}


const FindOneConversation=async(req,res)=>{
    try {
        const userId = req.params.userId;

        const conversations = await ConversationModel.find({ members: { $in: [userId] } });
        const conversationUserData = Promise.all(conversations.map(async (conversation) => {
            const receiverId = conversation.members.find((member) => member !== userId);
            const user = await UserModel.findById(receiverId);
            // console.log("user", user)
            return { user: { receiverId: user._id, email: user.email, fullname: user.fullname }, conversationId: conversation._id }
            
        }))
        res.status(200).json(await conversationUserData);
    }catch(err){

   res.status(500).json(err.message)
}
}

export {Conversation,FindOneConversation}