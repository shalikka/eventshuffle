const constructInsertEventQuery = (eventDates, eventId) => {
  if (!eventDates || eventDates.length < 1) {
    throw new Error('invalid input')
  }

  // Construct variable placeholders for date values based on the input in eventDates
  let variablePlaceHolders = ''
  const insertDatesValues = []
  let counter = 1
  eventDates.forEach((dateString, index) => {
    variablePlaceHolders += `($${index + counter}, $${index + counter + 1}), `
    insertDatesValues.push(dateString, eventId)
    counter += 1
  })

  // Remove last extra comma from the query
  const insertDatesQuery = `INSERT INTO event_date(date, event_id) VALUES ${variablePlaceHolders.slice(0, -2)}`
  return { insertDatesQuery: insertDatesQuery, insertDatesValues: insertDatesValues }
}

const constructInsertVoteQuery = (vote, eventId) => {
  if (!vote || !vote.votes || vote.votes.length < 1) {
    throw new Error('invalid input')
  }

  // Construct variable placeholders for date values based on the input in vote.votes
  // as $3, $4...
  // Starting from 3 as the first parameters are already reserved for person and eventId
  const startValue = 3
  let variablePlaceholders = ''
  const parameterValues = []
  parameterValues.push(vote.name)
  parameterValues.push(eventId)

  vote.votes.forEach((voteDate, index) => {
    variablePlaceholders += `$${startValue + index}, `
    parameterValues.push(voteDate)
  })

  // Remove comma and space from the end
  const insertVoteQuery = `INSERT INTO vote (person, event_date_id) SELECT $1, event_date.id FROM event_date
                            WHERE event_date.event_id = $2 AND event_date.date IN (${variablePlaceholders.slice(0, -2)}) 
                            RETURNING id`
  return { insertVoteQuery: insertVoteQuery, insertVoteValues: parameterValues }
}

module.exports = {
  constructInsertEventQuery,
  constructInsertVoteQuery
}
