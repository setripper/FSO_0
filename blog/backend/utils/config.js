require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI2

module.exports = {PORT, MONGODB_URI}