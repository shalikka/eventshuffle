const constructInsertEventQuery = (eventDates, eventId) => {
  if (!eventDates || eventDates.length < 1) {
    throw new Error('invalid input')
  }
  let insertDatesQuery = 'INSERT INTO event_date(date, event_id) VALUES '
  const insertDatesValues = []
  let counter = 1
  eventDates.forEach((dateString, index) => {
    insertDatesQuery += `($${index+counter}, $${index+counter+1}), `
    insertDatesValues.push(dateString, eventId)
    counter += 1
  })

  // Remove last extra comma from the query
  return { insertDatesQuery: insertDatesQuery.slice(0, -2), insertDatesValues: insertDatesValues }
}

module.exports = {
  constructInsertEventQuery
}
