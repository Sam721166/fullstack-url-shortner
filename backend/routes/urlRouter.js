import express from "express"
const urlRouter = express.Router()
import urlModel from "../model/urlModel.js"
import shortid from "shortid"


// create short url
urlRouter.post("/shortner", async (req, res) => {
    const body = req.body
    if(!body.redirectUrl){
        return res.json({
            msg: "enter URL properly"
        })
    }   

    const shortUrl = shortid(8)
    const url = await urlModel.create({
        shortId: shortUrl,
        redirectUrl: body.redirectUrl,
        visitHistory: []
    })
    return res.json(url)
})


// get the url from short url
urlRouter.get("/:shortId", async (req, res) => {
    try{
        const shortId = req.params.shortId
        const url = await urlModel.findOneAndUpdate({shortId}, {
            $push: {
                visitHistory: {timestamps: Date().toLocaleString("en-IN")}
            }
        })
        
        // redirect to the original link after searching the shortId from database that was created from the original link
        return res.redirect(url.redirectUrl) 
    } 
    catch(err){
        return res.status(404).json("error while get url:", err)
    }  
})


// show analytics
urlRouter.get("/analytics/:shortId", async (req, res) => {
    try{
        const shortId = req.params.shortId
        const result = await urlModel.findOne({shortId})
        if(!result){
            return res.json({
                msg: "enter the proper URL"
            })
        }
        return res.json({
            TotalClicks: result.visitHistory.length,
            Analytics: result.visitHistory
        })

    } catch(err){
        return res.json("error while veiwing analytics; ", err)
    }
})


// all url
urlRouter.get("/url/all", async (req, res) => {
    const url = await urlModel.find()
    return res.json(url)
})


export default urlRouter