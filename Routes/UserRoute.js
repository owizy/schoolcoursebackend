import { RegisterUser,LoginUser,UpadteFullname,UpdatePassword,UpdateEmail,UpadteUserType,Getalluser, Forgetpasswordtransport, MailForgetPassword, Uploadpicture, GetOneUserImage, UpadteoneuserImage,Deleteone } from "../Controllers/UserController.js";
import express from "express"
import multer from "multer";

export const UserRouter = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, uniqueSuffix + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });
    
  
UserRouter.post('/user/register',RegisterUser)
UserRouter.post('/user/login',LoginUser)
UserRouter.get('/users/:userId/getalluser',Getalluser)
UserRouter.post('/user/:userId/fullname',UpadteFullname)
UserRouter.post('/user/:userId/email',UpdateEmail)
UserRouter.post('/user/:userId/password',UpdatePassword)
UserRouter.post('/user/:userId/UserType',UpadteUserType)
UserRouter.post('/forgot-password',Forgetpasswordtransport)
UserRouter.post('/reset-password/:id/:token',MailForgetPassword)
UserRouter.post('/user/:userId/profilepicture',upload.single('image'),Uploadpicture );
UserRouter.get('/user/one/:userId/picture',GetOneUserImage)
UserRouter.post('/user/update/:userId/update',upload.single('image'), UpadteoneuserImage)
UserRouter.post('/admin/user/:userId/delete',Deleteone)
