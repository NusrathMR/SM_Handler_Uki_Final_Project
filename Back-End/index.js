import express from "express"
import dotEnv from "dotenv"
import bodyParser from "body-parser"

dotEnv.config()

const app = express()
const PORT = process.env.PORT || 8000

app.use(bodyParser.json())

app.listen(PORT, ()=>{
    console.log(`The server is running through http://localhost:${PORT}/`)
})