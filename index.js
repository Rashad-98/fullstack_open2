const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.use(cors())
app.use(express.json())

morgan.token('content', (request, response) => {
  return request.method === 'POST' ? JSON.stringify(request.body) : null
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

app.get('/api/persons', (request, respons) => {
  respons.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (!person) response.status(404).end()
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons/', (request, response) => {
  if (!request.body.name || !request.body.number) {
    return response.status(400).json({error: 'name or number missing'})
  }

  if (persons.find(person => person.name === request.body.name)) {
    return response.status(400).json({error: 'name must be unique'})
  }

  const id = Math.floor(Math.random() * 1000000)
  const person = {
    id: id,
    name: request.body.name,
    number: request.body.number
  }
  persons.concat(person)
  response.json(person)
})

app.get('/info', (request, response) => {
  let date = new Date()
  date = date.toString()
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>`
  )
})

const PORT = 3001
app.listen(PORT)
console.log(`server is up and listening on port ${PORT}`)
