const express = require('express')
var morgan = require('morgan')
const app = express()


app.use(express.json())
app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))
app.use(express.static('dist'))

let database = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  response.json(database)
})

app.get('/info', (request, response) => {
    response.send(`Phonebook has info for ${database.length} people<br/>${Date()}`)
})

app.get('/api/persons/:id', (request, response) => {

    const person = database.find(person => person.id === request.params.id)
    if (person) {
        response.json(person)
    } else {
        
        response.status(404).end()
    }

})


app.delete('/api/persons/:id', (request, response) => {

    database = database.filter(person => person.id !== request.params.id)
    response.status(204).end()

})

const generateId = () => {
  const max = 1000000
  return String(Math.floor(Math.random() * max))
}

app.post('/api/persons', (request, response) => {
  const body = request.body


  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  const personExist = database.find(person => person.name === body.name)
  if (personExist) {
    return response.status(400).json({ error: 'name already exists' })
  }
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  database = database.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
