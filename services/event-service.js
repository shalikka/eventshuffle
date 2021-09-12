const { throwNotFoundError, throwBadRequestError } = require('../util/error-util')
const { constructInsertVoteQuery, constructInsertEventQuery } = require('../util/event-db-util')
const { withTransactional } = require('./db-service')
const { formatDateStrings, formatVotes } = require('../util/event-util')

const getEvents = async () => {
  const result = await withTransactional((dbClient) => {
    return dbClient.query('SELECT id, name from event')
  })

  return {
    events: result.rows || []
  }
}

const getEvent = async (id) => {
  const result = await withTransactional((dbClient) => getEventQuery(id, dbClient))

  if (!result.event || result.event.rowCount < 1) {
    throwNotFoundError()
  }
  const event = result.event.rows[0]
  event.dates = formatDateStrings(result.event.rows[0].dates)
  event.votes = formatVotes(result.votes.rows)

  return event
}

const postEvent = async (event) => {
  const res = await withTransactional((dbClient) => insertEventQuery(event, dbClient))
  return { id: parseInt(res) }
}

const postVote = async (eventId, vote) => {
  const result = await withTransactional((dbClient) => insertVoteQuery(eventId, vote, dbClient))
  const event = result.event.rows[0]
  event.dates = formatDateStrings(result.event.rows[0].dates)
  event.votes = formatVotes(result.votes.rows)
  return event
}

const getEventResults = async (eventId) => {
  const result = await withTransactional((dbClient) => getResultQuery(eventId, dbClient))
  if (result.rowCount < 1) {
    throwNotFoundError()
  }
  return {
    id: result.rows[0].id,
    name: result.rows[0].name,
    suitableDates: formatVotes(result.rows)
  }
}

const insertEventQuery = async (event, dbClient) => {
  // First insert event
  const queryText = 'INSERT INTO event(name) VALUES($1) RETURNING id'
  const res = await dbClient.query(queryText, [event.name])
  const eventId = res.rows[0].id

  // Insert dates related to event using eventId just created
  const { insertDatesQuery, insertDatesValues } = constructInsertEventQuery(event.dates, eventId)

  await dbClient.query(insertDatesQuery, insertDatesValues)
  return eventId
}

const insertVoteQuery = async (eventId, vote, dbClient) => {
  const { insertVoteQuery, insertVoteValues } = constructInsertVoteQuery(vote, eventId)
  const res = await dbClient.query(insertVoteQuery, insertVoteValues)
  if (res.rowCount > 0) {
    return getEventQuery(eventId, dbClient)
  } else {
    throwBadRequestError()
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

const getResultQuery = async (eventId, dbClient) => {
  const participants = await dbClient.query(`
    SELECT COUNT(*) FROM
        (SELECT DISTINCT v.person
        FROM vote v
        LEFT JOIN event_date ed on ed.id = v.event_date_id
        LEFT JOIN event e on ed.event_id = e.id
           WHERE e.id = $1) as count`, [eventId])

  return dbClient.query(`
    SELECT e.id, e.name, ed.date, json_agg(v.person) AS people
    FROM event e
        LEFT JOIN event_date ed on e.id = ed.event_id
        INNER JOIN vote v on ed.id = v.event_date_id
    WHERE ed.event_id = $1
    GROUP BY e.id, e.name, ed.date
        HAVING COUNT(person) = $2;`, [eventId, participants.rows[0].count])
}

module.exports = {
  getEvents,
  getEvent,
  postEvent,
  postVote,
  getEventResults
}
