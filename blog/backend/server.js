const app = require('./app')
const config = require('./utils/config')
const mongoose = require('mongoose')
const logger = require('./utils/logger')

mongoose.connect(config.MONGODB_URI, { family: 4 })
    .then(() => {
        logger.info('connected to mongoDB')
    })
    .catch((error) => {
        logger.error('error connection to MongoDB:', error.message)
    })

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
})
