const express = require('express')
const router = express.Router()
const eventService = require('../services/event-service')
const { sendError } = require('../util/rest-util')

router.get('/list', (req, res) => {
  eventService.getEvents()
    .then(events => res.json(events))
    .catch(error => sendError(res, error))
})

router.get('/:id', (req, res) => {

})

router.get('/:id/results', (req, res) => {

})

router.post('/', (req, res) => {

})

router.post('/:id/vote', (req, res) => {

})

module.exports = router
