import UserModel from "../Models/UserModel.js"
import validator from "validator"
import jwt from "jsonwebtoken"
import brcypt from "bcryptjs"
import nodemailer from "nodemailer"
import fs from "fs"
import { ProfileModel } from "../Models/Profile.js"
import { CreatedChat } from "../Models/Messagecreated.js"
const CreateToken=(_id)=>{
  const JwtKey= process.env.JWTkey
  return jwt.sign({_id},JwtKey,{expiresIn:"3d"})
}
export const RegisterUser= async(req,res)=>{
   try{
      const{fullname,email,password,UserType,SecretKey}=req.body;
      const Findoneuser = await UserModel.findOne({email})
      if(Findoneuser) return res.status(400).json("User already exist")
      if(SecretKey !== "Futro@2023#Secure!") return res.status(400).json("Invalid Secretkey")
      if(!validator.isEmail(email)) return res.status(400).json("Email is not valid")
      if(!validator.isStrongPassword(password))   return res.status(400).json("Please enter a strong password")
      const Newuser = new UserModel({fullname,email,password,UserType})
      const salt = await brcypt.genSalt(10)
      Newuser.password= await brcypt.hash(Newuser.password,salt)
      await Newuser.save()
      const token= CreateToken(Newuser._id)
      return res.status(200).json({_id:Newuser._id,fullname:Newuser.fullname,email:Newuser.email,UserType:Newuser.UserType,token})
   }catch(err){
    console.log(`error:${err.message}`)
    res.status(500).json(err.message)
   }
}

export  const LoginUser=async(req,res)=>{
    try{ 
       const{email,password}=req.body
       if(!email || !password) return res.status(400).json("All field")
       const Olduser = await UserModel.findOne({email})
       if(!Olduser) return res.status(400).json("Invalid email or password")
       const Validatpassword = brcypt.compare(password,Olduser.password)
    if(!Validatpassword) return res.status(400).json("Invalid email or password")
       const token = CreateToken(Olduser._id)
    return res.status(200).json({_id:Olduser._id ,fullname:Olduser.fullname,email:Olduser.email,UserType:Olduser.UserType,token})
    }catch(err){
    console.log(`error:${err.message}`)
    res.status(500).json(err.message)
   }
}

export const UpadteFullname=async(req,res)=>{
  try{
    const userId = req.params.userId
 
    const Newfullname = req.body.fullname
    const user =await UserModel.findById( userId)
    if(!user) return res.status(400).json("user not found")
    user.fullname = Newfullname
 await user.save()
 return res.status(200).json({_id:user._id ,fullname:user.fullname,email:user.email,UserType:user.UserType})
  }catch(err){
    console.log(`error:${err.message}`)
    res.status(500).json(err.message)
   }
}


export const UpdateEmail=async(req,res)=>{
    try{
        const userId = req.params.userId
    const NewEmail = req.body.email
    const user = await UserModel.findById(userId)
    if(!user) return res.status(400).json("user not found")
    user.email = NewEmail
await user.save()
return res.status(200).json({_id:user._id ,fullname:user.fullname,email:user.email,UserType:user.UserType})
 
    }catch(err){
        console.log(`error:${err.message}`)
        res.status(500).json(err.message)
       }
}

export const UpdatePassword=async(req,res)=>{
    try{
        const userId = req.params.userId
    const Newpassword1 = req.body.password1
    const Newpassword2 = req.body.password2
    const compare = Newpassword1 === Newpassword2
    if(!compare) return res.status(400).json("Passwords is not the same") 
    const user = await UserModel.findById(userId)
    if(!user) return res.status(400).json("user not found")
    const salt = await brcypt.genSalt(10)
    const passwords = await brcypt.hash(Newpassword1,salt)
       user.password = passwords
       await   user.save()
       return res.status(200).json({_id:user._id ,fullname:user.fullname,email:user.email,UserType:user.UserType})
 
    }catch(err){
        console.log(`error:${err.message}`)
        res.status(500).json(err.message)
       }
}
export const UpadteUserType =async(req,res)=>{
        const userId = req.params.userId
        const NewType = req.body
        if(!NewType) return res.status(400).json("All field required")
        const user = UserModel.findById(userId)
        if(!user) return res.status(400).json("User not found")
       user.UserType = NewType
       await user.save()
       return  res.status(200).json({_id:user._id ,fullname:user.fullname,email:user.email,UserType:user.UserType})
 
}
export const Getalluser=async(req,res)=>{
  try{
    const userId = req.params.userId
const finduser = await UserModel.find({_id:{$ne:userId}});
const usersData = Promise.all(finduser.map(async(user)=>{
return{email:user.email,fullname:user.fullname,_id:user._id}
}))

res.status(200).json(await usersData)
}catch(err){
console.log("error : " + err.message)
res.status(500).json(err.message)
}
}
export const Forgetpasswordtransport=async(req,res)=>{
   try{
      const {email} = req.body;
      if(!email) return res.status(400).json("All field required ")
     const user =  await  UserModel.findOne({email})
 
      if(!user) return res.status(400).json("User does not exist")
        const token = jwt.sign({id: user._id}, "jwt_secret_key", {expiresIn: "1d"})
         var transporter = nodemailer.createTransport({
            service: 'gmail',
             auth: {
               user: 'futrolearnacademy@gmail.com',
               pass: 'twnyunxqbqjflese'
             },tls: {
              rejectUnauthorized: false, // Set this to true in production
       }      
           });
          
           var mailOptions = {
             from: 'futrolearnacademy@gmail.com',
             to: `${email}`,
             subject: 'Reset Password Link',
             html: `<link style={{display:"flex",flexDirection:"column"}}>
             <a> http://localhost:3000/reset_password/${user._id}/${token}</a>
             <p> This link will expire in the next 10minute</p>
             </link> `
           };
          
           transporter.sendMail(mailOptions, function(error, info){
             if (error) {
               console.log(error);
             } else {
               return res.send({Status: "Success"})
             }
          });
  
  
        

  }catch(err){
    console.log(`error:${err.message}`)
    res.status(500).json(err.message)
   }
  }

export const MailForgetPassword=async(req,res)=>{

  try{
    const {id, token} = req.params
    const {password,password1} = req.body
        if(password !== password1)  return res.status(400).json("password are not the same")
    jwt.verify(token, "jwt_secret_key", async(err, decoded) => {
        if(err) return res.json({Status: "Error with token"})
            const salt = await brcypt.genSalt(10)
            const passwords= await brcypt.hash(password,salt)
            await  UserModel.findByIdAndUpdate({_id: id}, {password: passwords})
              return res.send({Status: "Success"})
           
        
    })
  }catch(err){
    console.log(`error:${err.message}`)
    res.status(500).json({Status:err})
   }
   }
   

  export const Uploadpicture =async(req,res)=>{
  const userId = req.params.userId
  const imageName = req.file.filename;

  try {
       const picture =  await ProfileModel.create({userId, image: imageName });
    res.json({image:picture.image});
  } catch (error) {
    res.json({ status: error });
  }
}

export const GetOneUserImage=async(req,res)=>{
  const userId = req.params.userId
  
  const findonepicture = await ProfileModel.findOne({userId})
  if(!findonepicture)  return res.status(400).json('picture not found')
  return res.status(200).json({image:findonepicture.image})

}

export const UpadteoneuserImage=async(req,res)=>{
   const userId = req.params.userId
   const imageName = req.file.filename;

   const findonepicture = await ProfileModel.findOne({userId})
   const oldimage = `uploads/${findonepicture.image}`
   if(fs.existsSync(oldimage)) {
    fs.unlinkSync(oldimage)
    findonepicture.image = imageName
    await findonepicture.save() 
    return   res.status(200).json({image:findonepicture.image})  
   }else{
    return res.status(400).json("update failed")
   }
}

export const Deleteone =  async (req, res) => {
  const  userid  = req.params.userId;
  try {
    await   UserModel.findByIdAndDelete({ _id: userid });
    res.send({ status: "Ok", data: "Deleted" });
  } catch (error) {
    console.log(error);
  }
}