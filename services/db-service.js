const { getDbPool } = require('../util/database')

const dbPool = getDbPool()

const withTransactional = async (fn) => {
  const dbClient = await dbPool.connect()
  let response = undefined

  try {
    await dbClient.query('BEGIN')

    response = await fn(dbClient)

    await dbClient.query('COMMIT')
  } catch (exception) {
    await dbClient.query('ROLLBACK')
    throw exception
  } finally {
    dbClient.release()
  }

  return response
}

module.exports = {
  withTransactional
}
