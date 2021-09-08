const { constructInsertEventQuery } = require('./db-util')

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
