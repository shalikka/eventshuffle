const express = require('express')
const config = require('./util/config')
const event = require('./routes/event')

const app = express()

app.use('/api/v1/event', express.json(), event)

app.listen(config.PORT, () => {
  console.log(`server started on port ${config.PORT}`)
})
