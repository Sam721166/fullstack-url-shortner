import mongoose from "mongoose";

const urlSchema = mongoose.Schema({
    shortId: {
        type: String,
        unique: true,
        require: true
    },
    redirectUrl: {
        type: String,
        require: true
    },
    visitHistory: [{
        timestamps: {type: String}
    }]
})

export default mongoose.model("url", urlSchema)