import user from "../models/userModel.js";

export const createUser = async (req,res)=>{
    try{
        const userData = new user(req.body)
        const {email} = userData;

        const userExist = await user.findOne({email})
        if (userExist){
            return res.status(400).json({message:"User already exist..."})
        }

        const saveUser = await userData.save();
        res.status(200).json(saveUser)

    }catch(error){
        console.error(error)
        res.status(500).json({error: "Internal server Error..."})
    }
}