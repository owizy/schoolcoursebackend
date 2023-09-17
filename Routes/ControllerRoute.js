import express from "express"
import { Conversation, FindOneConversation } from "../Controllers/ConversationController.js"

const ConversationRoute = express.Router()


ConversationRoute.post('/api/conversation',Conversation)
ConversationRoute.get('/api/conversations/:userId',FindOneConversation)

export default ConversationRoute