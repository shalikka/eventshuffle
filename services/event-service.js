const { STATUS_CODES } = require('../util/error-util')
const { constructInsertVoteQuery, constructInsertEventQuery } = require('../util/event-db-util')
const { withTransactional } = require('./db-service')

const insertEventQuery = async (event, dbClient) => {
  const queryText = 'INSERT INTO event(name) VALUES($1) RETURNING id'
  const res = await dbClient.query(queryText, [event.name])
  const eventId = res.rows[0].id

  const { insertDatesQuery, insertDatesValues } = constructInsertEventQuery(event.dates, eventId)

  await dbClient.query(insertDatesQuery, insertDatesValues)
  return eventId
}

const insertVoteQuery = async (eventId, vote, dbClient) => {
  const { insertVoteQuery, insertVoteValues } = constructInsertVoteQuery(vote, eventId)
  const res = await dbClient.query(insertVoteQuery, insertVoteValues)
  if (res.rowCount > 0) {
    return getEvent(eventId)
  } else {
    throw { statusCode: STATUS_CODES.statusBadRequest }
  }
}

const getEventQuery = async (eventId, dbClient) => {
  const event = await dbClient.query(`
        SELECT e.id, e.name, json_agg(dates.date) AS dates 
        FROM event e
            LEFT JOIN event_date dates ON dates.event_id = e.id 
        WHERE e.id = $1
        GROUP BY e.id, e.name`, [eventId])
  const votes = await dbClient.query(`
        SELECT e.date, json_agg(v.person) AS people
        FROM event_date e 
            INNER JOIN vote v on e.id = v.event_date_id 
        WHERE e.event_id = $1
        GROUP BY e.date, e.event_id`, [eventId])
  return { event, votes }
}

const getEvents = async () => {
  const result = withTransactional((dbClient) => {
    return dbClient.query('SELECT id, name from event')
  })

  return {
    events: result.rows || []
  }
}

const getEvent = async (id) => {
  const result = await withTransactional((dbClient) => getEventQuery(id, dbClient))

  if (!result.event || result.event.rowCount < 1) {
    throw { statusCode: STATUS_CODES.statusNotFound }
  }
  const event = result.event.rows[0]
  event.votes = result.votes.rows
  return event
}

const postEvent = async (event) => {
  const res = await withTransactional((dbClient) => insertEventQuery(event, dbClient))
  return { id: parseInt(res) }
}

const postVote = (eventId, vote) => {
  return withTransactional((dbClient) => insertVoteQuery(eventId, vote, dbClient))
}

module.exports = {
  getEvents,
  getEvent,
  postEvent,
  postVote
}
