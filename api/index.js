const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
require('dotenv').config()
const Person = require('../models/person.js')
const app = express()

app.use(cors())
app.use(express.static(path.join(__dirname, '..', 'dist')))
app.use(express.json())

morgan.token('data', (req) => {
  const filteredObj = req.body
  return req.body ? JSON.stringify(filteredObj) : ' '
})

app.use(morgan(':method :url :status :res[content-length]- :response-time ms :data'))

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(person => {
      person ? response.json(person) : []
    })
    .catch((error) => next(error))
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      response.send(`<p>Phonebook has info for ${count} people</p><p>${new Date}</p>`)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const urlId = request.params.id
  Person.findById(urlId)
    .then(returnedPerson => {
      returnedPerson ? response.json(returnedPerson) : response.status(404).send('resource not found')
    })
    .catch((error) => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
  const urlId = request.params.id
  Person.findByIdAndDelete(urlId)
    .then((person) => {
      if (!person) {
        response.status(404).send({ error: 'Person not found!' })
      }
      response.status(204).end()
    })
    .catch((error) => next(error))
})


app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body
  const person = new Person({
    name: name,
    number: number,
  })
  person.save()
    .then(result => response.json(result))
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  const urlId = request.params.id
  const updatedPerson = { urlId, name, number }
  Person.findByIdAndUpdate(urlId, updatedPerson, { new: true, runValidators: true })
    .then((person) => {
      if (!person) {
        response.status(404).send({ error: 'person not found!' })
      }
      response.json(person)
    })
    .catch(error => next(error))
})

app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
})

const port = process.env.PORT || 3002
app.listen(port)
console.log(`server running on port ${port}`)


const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    response.status(400).send({ error: 'Malformatted ID' })
  }
  else if (error.name === 'ValidationError') {
    response.status(400).send({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)



