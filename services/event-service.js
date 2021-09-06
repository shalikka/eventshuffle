const { getDbPool } = require('../util/database')
const { STATUS_CODES } = require('../util/error-util')

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

const getEvent = (id) => {
  const param = [id]
  return dbPool.query('SELECT id, name from event WHERE id = $1', param)
    .then(result => {
      if (!result.rows || result.rows.length < 1) {
        throw { statusCode: STATUS_CODES.statusNotFound }
      }
      return result.rows[0]
    })
    .catch(error => new Promise(() => {
      throw error
    }))
}

module.exports = {
  getEvents,
  getEvent
}
