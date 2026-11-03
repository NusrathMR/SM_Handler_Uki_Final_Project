import mongoose from "mongoose"
import dns from "node:dns"

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDb = async ()=>{
    try{
        const connection = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Databases connected successfully... ${connection.connection.host}`)
    }
    catch(error){
        console.log(`Databases connection failure... ${error.message}`)
        process.exit(1)
    }
}

export default connectDb;