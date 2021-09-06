const { getDbPool } = require('../util/database')

const dbPool = getDbPool()

const getEvents = () => {
  return dbPool.query('SELECT id, name from event')
    .then(result => {
      return {
        events: result.rows
      }
    })
    .catch(error => new Promise(() => {
      throw error
    }))
}

module.exports = {
  getEvents
}
