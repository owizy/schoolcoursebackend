import { RegisterUser,LoginUser,UpadteFullname,UpdatePassword,UpdateEmail,UpadteUserType,Getalluser, Forgetpasswordtransport, MailForgetPassword, Uploadpicture, GetOneUserImage, UpadteoneuserImage,Deleteone } from "../Controllers/UserController.js";
import express from "express"
import multer from "multer";
import cloudinary from "../utills/Cloudinary.js";
import { ProfileModel } from "../Models/Profile.js";
export const UserRouter = express.Router()

const storage = multer.diskStorage({
  filename: function (req,file,cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({storage: storage});
  
UserRouter.post('/user/register',RegisterUser)
UserRouter.post('/user/login',LoginUser)
UserRouter.get('/users/:userId/getalluser',Getalluser)
UserRouter.post('/user/:userId/fullname',UpadteFullname)
UserRouter.post('/user/:userId/email',UpdateEmail)
UserRouter.post('/user/:userId/password',UpdatePassword)
UserRouter.post('/user/:userId/UserType',UpadteUserType)
UserRouter.post('/forgot-password',Forgetpasswordtransport)
UserRouter.post('/reset-password/:id/:token',MailForgetPassword)
UserRouter.post('/user/:userId/profilepicture',upload.single('image'),async (req, res) => {
  try {
     const userId = req.params.userId
    const imageName = req.file.path
    console.log("image",imageName)
    const result = await cloudinary.uploader.upload(imageName);
    console.log("result",result)
    console.log("resultUrl",result.url)
    const picture =  await ProfileModel.create({userId, image: result.url });
        res.json({image:picture.image});
  } catch (err) {
    res.json({ status: err });

  }
} ); 
UserRouter.get('/user/one/:userId/picture',GetOneUserImage)
UserRouter.post('/user/update/:userId/update',upload.single('image'),async (req, res) => {
try{
  const userId = req.params.userId
  const imageName = req.file.path
   const findonepicture = await ProfileModel.findOne({userId})
   const result = await cloudinary.uploader.upload(imageName);
   findonepicture.image = result.url
   await findonepicture.save() 
    return   res.status(200).json({image:findonepicture.image})  
}catch(err){
  console.log("err",err)
  return res.json("update failed")

}

})
UserRouter.post('/admin/user/:userId/delete',Deleteone)
