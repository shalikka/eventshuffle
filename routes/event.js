const express = require('express')
const router = express.Router()
const eventService = require('../services/event-service')
const { sendError, STATUS_CODES } = require('../util/error-util')

router.get('/list', (req, res) => {
  eventService.getEvents()
    .then(events => res.json(events))
    .catch(error => sendError(res, error))
})

router.get('/:id', (req, res) => {
  eventService.getEvent(req.params.id)
    .then(event => res.json(event))
    .catch(error => sendError(res, error))
})

router.get('/:id/results', (req, res) => {
  eventService.getEventResults((req.params.id))
    .then(results => res.json(results))
    .catch(error => sendError(res, error))
})

router.post('/', (req, res) => {
  eventService.postEvent(req.body)
    .then(id => {
      res.status(STATUS_CODES.statusCreated)
      res.json(id)
    })
    .catch(error => sendError(res, error))
})

router.post('/:id/vote', (req, res) => {
  eventService.postVote(req.params.id, req.body)
    .then(result => {
      res.status(STATUS_CODES.statusCreated)
      res.json(result)
    })
    .catch(error => sendError(res, error))
})

module.exports = router
