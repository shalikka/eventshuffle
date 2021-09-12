const STATUS_CODES = {
  statusOk: 200,
  statusCreated: 201,
  statusBadRequest: 400,
  statusNotFound: 404,
  statusInternalError: 500
}

const sendError = (res, err) => {
  res.status(err.statusCode ||
    (err.message.includes('invalid input') ? STATUS_CODES.statusBadRequest : STATUS_CODES.statusInternalError))

  res.send({})
}

const throwNotFoundError = () => {
  const error = new Error()
  error.statusCode = STATUS_CODES.statusNotFound
  throw error
}

const throwBadRequestError = () => {
  const error = new Error()
  error.statusCode = STATUS_CODES.statusBadRequest
  throw error
}

module.exports = {
  STATUS_CODES,
  sendError,
  throwNotFoundError,
  throwBadRequestError
}
