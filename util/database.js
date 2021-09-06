const { Pool } = require('pg')

const pgConfig = {
  host: process.env.POSTGRES_SERVER,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  port: process.env.POSTGRES_PORT
}

const getDbPool = () => {
  return new Pool(pgConfig)
}

module.exports = {
  getDbPool
}
