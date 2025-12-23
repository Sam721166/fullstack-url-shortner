import dotenv from "dotenv"
dotenv.config()

import express from "express"
const app = express()

import {ConectDB} from "./db/db.js"
ConectDB()


import urlRouter from "./routes/urlRouter.js"

app.use(express.json())


app.get("/", (req, res) => {
    res.send("hello server")
})

app.use("/api", urlRouter)



app.listen(3000, (req, res) => {
    console.log("server is running on port http://localhost/3000");
})