import mongoose from 'mongoose'

let DB = null
export const connectDB = async () => {
  try {
    const DB = await mongoose.connect(process.env.MONGO_DB, {
      dbName: process.env.DB_NAME
    })
    // console.log('Connected to MongoDB')
    return DB
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    // process.exit(1) // Exit the process if connection fails
  }
}

export const getDB = () => {
  if (!DB) {
    throw new Error('Database not connected. Call connectDB() first.')
  }
  return DB
}


export const EXIT_DB = async () => {
  if (DB) {
    try {
      await mongoose.connection.close()
      console.log('Database connection closed')
    } catch (error) {
      console.error('Error closing database connection:', error)
    }
  } else {
    console.warn('No database connection to close')
  }
}