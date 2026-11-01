import express from "express"
import dotEnv from "dotenv"
import bodyParser from "body-parser"
import connectDb from "./config/db.js"
import userRoute from "./routes/userRoute.js"
import cors from "cors"
import postRoute from "./routes/postRoute.js"
import { startScheduler } from "./services/schedulerService.js"
import aiRoute from "./routes/aiRoute.js"
import mediaRoute from "./routes/mediaRoute.js"



dotEnv.config()

const app = express()
const PORT = process.env.PORT || 8000

connectDb()
startScheduler()

app.use(bodyParser.json())
app.use(cors())

app.use("/api/user", userRoute)
app.use("/api/posts", postRoute)
app.use("/api/ai", aiRoute)
app.use("/api/media", mediaRoute)


app.listen(PORT, ()=>{
    console.log(`The server is running through http://localhost:${PORT}/`)
})