require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))

const Person = require('./models/person')

app.use(express.json())
app.use(morgan('tiny'))


app.get('/api/persons', (req, res, next) => {
	Person.find({}).then(result => {
		res.json(result)
	}).catch(error => next(error))

})

app.get('/info', (req, res, next) => {
	Person.find({}).then(result => res.send(`
    <p>Phonebook has info for ${result.length} people</p>
    <p>${new Date()}</p>
`)).catch(error => next(error))

})

app.get('/api/persons/:id', (req, res, next) => {
	Person.findById(req.params.id)
		.then(person => {
			if (person) {
				res.json(person)
			} else {
				res.status(404).end()
			}
		})
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then(() => res.status(204).end())
		.catch( error => next(error))

})

morgan.token('body', (req, res) => {
	return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.post('/api/persons', (req, res, next) => {
	const { name, number } = req.body


	const person = new Person({
		name, number
	})

	person.save().then( person => res.json(person)).catch( error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
	const { name, number } = req.body

	Person.findByIdAndUpdate(req.params.id,{ name, number } , { new: true, runValidators: true, context: 'query' })
		.then(newPerson => res.json(newPerson))
		.catch( error => next(error))
})

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).send({ error: error.message })
	}
	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}...`)
})
