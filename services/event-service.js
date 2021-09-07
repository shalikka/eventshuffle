const { getDbPool } = require('../util/database')
const { STATUS_CODES } = require('../util/error-util')
const { constructInsertEventQuery } = require('../util/db-util')

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

const postEvent = async (event) => {
  const dbClient = await dbPool.connect()

  try {
    await dbClient.query('BEGIN')
    const queryText = 'INSERT INTO event(name) VALUES($1) RETURNING id'
    const res = await dbClient.query(queryText, [event.name])

    const { insertDatesQuery, insertDatesValues } = constructInsertEventQuery(event.dates, res.rows[0].id)

    await dbClient.query(insertDatesQuery, insertDatesValues)
    await dbClient.query('COMMIT')
  } catch (exception) {
    await dbClient.query('ROLLBACK')
    throw exception
  } finally {
    dbClient.release()
  }
}

module.exports = {
  getEvents,
  getEvent
}
