import User from "../models/userModel.js"; 
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const registerUser = async (req,res)=>{
    try{
        const {email, password, confirmPassword, fullname } = req.body

        console.log("BODY:", req.body)

        if (!email || !password || !confirmPassword || !fullname){
            return res.status(400).json({message:"All fields are required..."})
        }

        if (password.length<6){
            return res.status(400).json({message:"Password should have 6 characters..."})
        }

        if (password !== confirmPassword){
            return res.status(400).json({message:"Passwords don't match..."})
        }

        const userExist = await User.findOne({email})
        if(userExist){
            return res.status(400).json({message:"User already existed..."})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const userData = new User({
            fullname: fullname,
            email: email,
            password: hashedPassword
        })

        const saveUser = await userData.save()
        res.status(200).json({message: "User registered successfully...",})

    }catch(error){
        res.status(500).json({error: "Internal server error..."})
        console.error(error)
    }
}

// Authenticate users by JWT | SignIn page

export const userSignIn = async (req,res)=>{
    try{
        const {email,password} = req.body
        
        if(!email || !password){
            return res.status(400).json({message:"All fields are required..."})
        } 

        const findUser = await User.findOne({email}).select("+password")
        if (!findUser){
            return res.status(400).json({message:"Username or password is wrong..."})
        }
        
        const comparePassword = await bcrypt.compare(password, findUser.password)
        if (!comparePassword){
            return res.status(400).json({message:"Username or password is wrong..."})
        }

        if (!findUser.isActive){
            return res.status(403).json({message: "This account is deactivated..."})
        }

        findUser.lastLoginAt = new Date()
        const saveDate = await findUser.save()

        const createToken = jwt.sign(
            {id: findUser._id},
            process.env.JWT_SECRET_TOKEN,
            {expiresIn: process.env.JWT_EXPIRE_IN}
        )

        res.status(200).json({
            message:"User signed in successfully...",
            token:createToken,
            user:{
                id:findUser._id,
                name:findUser.fullname,
                email:findUser.email,
                role:findUser.role,
                plan:findUser.plan,
            }
        })
    }catch(error){
        res.status(500).json({error:"Internal server error..."})
        console.error(error)
    }
}

export const getMe = async (req, res) =>{
    res.status(200).json({
        user:{
            id:req.user._id,
            email:req.user.email,
            role: req.user.role,
            plan:req.user.plan,
            profilePicture:req.user.profilePicture,
            isEmailVerified: req.user.isEmailVerified,
            lastLoginAt: req.user.lastLoginAt,
            createdAt: req.user.createdAt,
        }
    })
}