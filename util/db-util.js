const constructInsertEventQuery = (eventDates, eventId) => {
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
