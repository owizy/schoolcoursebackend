import express from "express"
import { Message, MessageOne } from "../Controllers/MessageController.js"

const MessageRoute = express.Router()

MessageRoute.post('/api/messsage',Message)
MessageRoute.get('/api/messsage/:conversationId',MessageOne)

export default MessageRoute