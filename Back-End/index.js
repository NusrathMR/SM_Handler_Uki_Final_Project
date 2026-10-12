import express from "express"
import dotEnv from "dotenv"
import bodyParser from "body-parser"
import userRoute from "./route/userRoute.js"
import connectDb from "./config/db.js"

dotEnv.config()
connectDb();

const app = express()
const PORT = process.env.PORT || 8000

app.use(bodyParser.json())
app.use("/api/user", userRoute)

app.listen(PORT, ()=>{
    console.log(`The server is running through http://localhost:${PORT}/`)
})