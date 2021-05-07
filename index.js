require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
//built-in library to make using Node's http module easier to use and scale
const app = express()

const Person = require('./models/person')

//middleware: functions that we can use to handle request and response objects
// use before route so they're executed before route event handlers are called
// if we use them after route definitions, we're essentially defining middleware that handles requests that no route picks up 

//taking json-parser middleware into use
//function: takes raw data from request object, parses into JSON and attaches that to request object as a new property 'body' 
app.use(express.json())

//middleware: whenever express gets an HTTP GET request it will first check if the build directory contains a page corresponding to the request address. If Y -> returns it
app.use(express.static('build'))


//taking into use middleware that allows requests from all origins (e.g. frontend from localhost:3000)
app.use(cors())

//creating new morgan token representing the body of the request that's sent (e.g. newPersonObject when sending POST request to add new contact to phonebook)
morgan.token('body', function(req, res) {return JSON.stringify(req.body)})

//taking morgan middleware into use, custom configuration including body of request
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res), 
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms', 
        tokens.body(req, res)
    ].join(' ')
}))

// let persons = [
//     {
//         id: 1, 
//         name: "Arto Hellas", 
//         number: "040-123456" 

//     }, 
//     {
//         id: 2,
//         name: "Ada Lovelace",
//         number: "39-44-5323523"

//     }, 
//     {
//         id: 3,
//         name: "Dan Abramov", 
//         number: "12-43-234345"

//     }, 
//     {
//         id: 4, 
//         name: "Mary Poppendieck", 
//         number: "39-23-6423122"
//     }
// ]

//routes
//event handler used to handle HTTP GET requests made to app's / root
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person
        .find({})
        .then(persons => {
            response.json(persons)
        })
})

app.get('/info', (request, response, next) => {
    Person
        .find({})
        .then(persons => {
            var info = `Phonebook has info for ${persons.length} people`
            var date = `<br/> <br/> ${ new Date() }`
            response.send(info + date)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person
        .findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person
        .findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))

})


app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name) {
        response.status(400).json({
            error: 'name missing'
        })
    } else if (!body.number) {
        response.status(400).json({
            error: 'number missing'
        })

    } else {
    const person = new Person({
        name: body.name, 
        number: body.number
    })

    person
        .save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
    }
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    //Not using Person constructor because findByIdAndUpdate receives a regular JS object
    const person = {
        name: body.name,
        number: body.number
    }

    Person
        .findByIdAndUpdate(request.params.id, { number: body.number }, { new: true, runValidators: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

//middleware for catching + dealing with error requests made to non-existent routes
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

//Express error handling middleware is defined as a function with 4 parameters
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }

    //in all other cases, pass the error forward to the default Express error handler
    next(error)
}

//Taken into use last because otherwise all requests would be handled as if they were errors
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
