import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import { UserRouter } from "./Routes/UserRoute.js"
import MessageRoute from "./Routes/MessageRoute.js"
import ConversationRoute from "./Routes/ControllerRoute.js"
import UserModel from "./Models/UserModel.js"
import { Server } from "socket.io"
import ConversationModel from "./Models/Conversation.js"
import MessageModel from "./Models/Message.js"
dotenv.config()
const app= express()
mongoose.connect(process.env.Db_Connect).then(()=>{
    console.log('connected to mongodb successful')
}).catch((err)=>{
    console.log(`connection failed due to:${err}`)
})
// middleware
app.use(express.json())
app.use(cors())
app.use(UserRouter, express.static('uploads/'))
app.use(MessageRoute)
app.use(ConversationRoute)
app.get('/',(req,res)=>{
    res.send("Welcome to  FutrolearnAcademy")
})

// socket
const io = new Server({cors:"https://futrolearnacademy-4wjr.onrender.com" ,    methods: ['GET', 'POST'],
})


let users = [];
io.on('connection', (socket)=>{
    // console.log('User connected', socket.id);
    socket.on('addUser', userId => {
        const isUserExist = users.find(user => user.userId === userId);
        if (!isUserExist) {
            const user = { userId, socketId: socket.id };
            users.push(user);
            io.emit('getUsers', users);
        }
    });
   
socket.on('sendMessage', async ({ senderId, receiverId, message, conversationId })=> {
      console.log("socketreceiveId",receiverId)
        const receiver = users.find(user => user.userId === receiverId);
        const sender = users.find(user => user.userId === senderId);
        const user = await UserModel.findById(senderId);
        console.log('sender :>> ', sender, receiver);
        if (receiver) {
            io.to(receiver?.socketId).to(sender?.socketId).emit('getMessage', {
                senderId,
                message,
                conversationId,
                receiverId,
                user: { id: user._id, fullName: user.fullName, email: user.email }
            });
            }else{
                io.to(sender.socketId).emit('getMessage',{
                    senderId,
                    message,
                    conversationId,
                    receiverId,
                    user: { id: user._id, fullName: user.fullName, email: user.email }
                });
            }


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
            //  res.status(200).json('message succesful');
        });

        socket.on("joingroupchat",(data)=>{
            socket.join(data)
            console.log(`User with Id:${socket.id} joined room ${data}`)
        })
          socket.on("GroupMessage",data=>{
            io.emit("receiveMessage",data)
            console.log("message",data)
          })  
        socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id);
        io.emit('getUsers', users);
    });
    io.emit('getUsers', socket.userId);
});    

const Port = 5000 || process.env.Port
app.listen(Port,(req,res)=>{
    console.log( `http://localhost:${Port}`)
})
io.listen(Port)
