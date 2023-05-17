import * as mongoose from 'mongoose'

export default async function connectDB(DB_URI: string) {
    try {
        await mongoose.connect(DB_URI, {
            dbName: 'TOOPCC'
        })
        console.log('Connect to MongoDB!')
    } catch {
        console.error("Connection Failed!")
    }
}