const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(cors())

let people = [
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

app.use(express.json())
app.use(morgan('tiny'))


app.get('/api/persons', (req, res) => {
    res.json(people)
})

app.get('/info', (req, res) => {
    res.send(`
        <p>Phonebook has info for ${people.length} people</p>
        <p>${new Date()}</p>
    `)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = people.find(per => per.id === id)
    if (!person) {
        res.status(404).end()
    } else {
        res.json(person)
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id) 
    people = people.filter(per => per.id !== id)
    res.status(204).end()
})

morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.post('/api/persons', (req, res) => {
    const id = Math.random() * 1000
    const person = req.body

    if (!person.name || !person.number) {
        return res.status(400).json({
            error: 'Name and number must not be empty'
        })
    } else if (people.find(per => per.name.toLowerCase() === person.name.toLowerCase())) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    person.id = id
    people = people.concat(person)
    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`)
})
