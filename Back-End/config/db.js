import mongoose from "mongoose"

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