import mongoose from "mongoose";

const ConectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB is connected");
    } catch(err){
        console.log("error while conect MongoDB", err);
    }
}

export {ConectDB}  