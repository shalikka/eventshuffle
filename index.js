const express = require('express')
const config = require('./util/config')

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(config.PORT, () => {
  console.log(`server started on port ${config.PORT}`)
})
