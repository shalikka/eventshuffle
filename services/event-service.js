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
}

const getEvent = (id) => {
  const param = [id]
  return dbPool.query(`
        SELECT events.id, events.name, json_agg(date) AS dates 
        FROM event events
            LEFT JOIN event_date dates ON dates.event_id = events.id 
        WHERE events.id = $1
        GROUP BY events.id, events.name`, param)
    .then(result => {
      if (!result.rows || result.rows.length < 1) {
        throw { statusCode: STATUS_CODES.statusNotFound }
      }
      return result.rows[0]
    })
}

const postEvent = async (event) => {
  const dbClient = await dbPool.connect()
  let eventId

  try {
    await dbClient.query('BEGIN')
    const queryText = 'INSERT INTO event(name) VALUES($1) RETURNING id'
    const res = await dbClient.query(queryText, [event.name])
    eventId = res.rows[0].id

    const { insertDatesQuery, insertDatesValues } = constructInsertEventQuery(event.dates, eventId)

    await dbClient.query(insertDatesQuery, insertDatesValues)
    await dbClient.query('COMMIT')
  } catch (exception) {
    await dbClient.query('ROLLBACK')
    throw exception
  } finally {
    dbClient.release()
  }

  return { id: parseInt(eventId) }
}

module.exports = {
  getEvents,
  getEvent,
  postEvent
}
