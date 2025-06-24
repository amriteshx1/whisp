import mongoose from "mongoose";

//Connect to mongo db
export const connectDb = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Db connected"));
        
        await mongoose.connect(`${process.env.MONGODB_URI}/whisp`);

    } catch (error) {
        console.log(error);
    }
}