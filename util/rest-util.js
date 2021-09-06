const STATUS_CODES = {
  statusOk: 200,
  statusCreated: 201,
  statusBadRequest: 400,
  statusNotFound: 404,
  statusInternalError: 500
}

const sendError = (res, err) => {
  res.status(err.statusCode || STATUS_CODES.statusInternalError)
  res.send({})
}


module.exports = {
  STATUS_CODES,
  sendError
}
