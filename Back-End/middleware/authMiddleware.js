import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

export const protect = async (req, res, next)=>{
    try{
        const authHeader = req.headers.authorization

        if(!authHeader || !authHeader.startsWith("Bearer")){
            return res.status(401).json({message: "No authorized, no token..."})
        }

        const token = authHeader.split(" ")[1] 
        
        // console.log("HEADER:", authHeader)
        // console.log("TOKEN:", token)
        // console.log("DOTS IN TOKEN:", token ? token.split(".").length - 1 : "no token")

        const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN)

        const user = await User.findById(decoded.id)

        if (!user){
            return res.status(401).json({message: "User no longer exists..."})
        }

        if (!user.isActive){
            return res.status(403).json({message: "This account is deactivated..."})
        }

        req.user = user

        next()
        
    }catch(error){

        console.error(`Protect error: ${error.name} - ${error.message}`)

        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError"){
            return res.status(401).json({message: "Not authorized, token is invalid or expired..."})
        }
        console.error(error)
        res.status(500).json({error: "Internal server error..."})

    }
}