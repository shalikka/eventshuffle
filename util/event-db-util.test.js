const { constructInsertEventQuery, constructInsertVoteQuery } = require('./event-db-util')

describe('constructInsertEventQuery', () => {
  it('Construct parametrized query for event_date insertion with several values', () => {
    const eventId = 1
    const eventDates = ['2021-01-01',
      '2021-01-02',
      '2021-02-13']

    const expectedQuery = 'INSERT INTO event_date(date, event_id) VALUES ($1, $2), ($3, $4), ($5, $6)'
    const expectedValues = ['2021-01-01', 1, '2021-01-02', 1, '2021-02-13', 1]

    const actual = constructInsertEventQuery(eventDates, eventId)

    expect(actual.insertDatesQuery).toEqual(expectedQuery)
    expect(actual.insertDatesValues).toEqual(expectedValues)
  })
  it('Construct parametrized query for event_date insertion with one value', () => {
    const eventId = 1
    const eventDates = ['2021-01-01']

    const expectedQuery = 'INSERT INTO event_date(date, event_id) VALUES ($1, $2)'
    const expectedValues = ['2021-01-01', 1]

    const actual = constructInsertEventQuery(eventDates, eventId)

    expect(actual.insertDatesQuery).toEqual(expectedQuery)
    expect(actual.insertDatesValues).toEqual(expectedValues)
  })

  it('Construct parametrized query for event_date insertion with no date values', () => {
    expect(() => {
      constructInsertEventQuery([], 1)
    }).toThrowError('invalid input')
  })
})

describe('constructInsertVoteQuery', () => {
  it('Construct parametrized query for vote insertion with several values', () => {
    const eventId = 1
    const vote = {
      name: 'Test',
      votes: [
        '2021-01-01',
        '2021-01-02',
        '2021-02-13',
        '2020-04-03',
        '2021-09-13'
      ]
    }

    const expectedQuery = `INSERT INTO vote (person, event_date_id) SELECT $1, event_date.id FROM event_date
                            WHERE event_date.event_id = $2 AND event_date.date IN ($3, $4, $5, $6, $7) 
                            RETURNING id`
    const expectedValues = ['Test', 1, '2021-01-01', '2021-01-02', '2021-02-13', '2020-04-03', '2021-09-13']

    const actual = constructInsertVoteQuery(vote, eventId)

    expect(actual.insertVoteQuery).toEqual(expectedQuery)
    expect(actual.insertVoteValues).toEqual(expectedValues)
  })
  it('Construct parametrized query for vote insertion with one value', () => {
    const eventId = 1
    const vote = {
      name: 'Test',
      votes: [
        '2021-01-01'
      ]
    }

    const expectedQuery = `INSERT INTO vote (person, event_date_id) SELECT $1, event_date.id FROM event_date
                            WHERE event_date.event_id = $2 AND event_date.date IN ($3) 
                            RETURNING id`
    const expectedValues = ['Test', 1, '2021-01-01']

    const actual = constructInsertVoteQuery(vote, eventId)

    expect(actual.insertVoteQuery).toEqual(expectedQuery)
    expect(actual.insertVoteValues).toEqual(expectedValues)
  })

  it('Construct parametrized query for vote insertion with no date values', () => {
    expect(() => {
      constructInsertVoteQuery({ name: 'Test', votes: [] }, 1)
    }).toThrowError('invalid input')
  })
})
