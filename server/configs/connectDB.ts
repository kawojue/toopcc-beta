import mongoose from "mongoose"

const connectDB = async (DATABASE_URL: string) => {
    try {
        await mongoose.connect(DATABASE_URL, {
            dbName: "TOOPCC"
        })
    } catch {
        throw new Error("Connection Failed!")
    }
}

export default connectDB