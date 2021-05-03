const express = require('express')
const morgan = require('morgan')
//built-in library to make using Node's http module easier to use and scale
const app = express()

//middleware: functions that we can use to handle request and response objects
// use before route so they're executed before route event handlers are called
// if we use them after route definitions, we're essentially defining middleware that handles requests that no route picks up 

//taking json-parser middleware into use
//function: takes raw data from request object, parses into JSON and attaches that to request object as a new property 'body' 
app.use(express.json())

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

let persons = [
    {
        id: 1, 
        name: "Arto Hellas", 
        number: "040-123456" 

    }, 
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"

    }, 
    {
        id: 3,
        name: "Dan Abramov", 
        number: "12-43-234345"

    }, 
    {
        id: 4, 
        name: "Mary Poppendieck", 
        number: "39-23-6423122"
    }
]

//routes
//event handler used to handle HTTP GET requests made to app's / root
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    var info = `Phonebook has info for ${persons.length} people` 
    var date = `<br/> <br/> ${new Date()}`
    response.send(info + date)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
   
})

app.delete('/api/persons/:id', (request, response) => {
    persons = persons.filter(p => p.id !== Number(request.params.id))
    response.status(204).end()

})


app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        response.status(400).json({
            error: 'name missing'
        })
    } else if (!body.number) {
        response.status(400).json({
            error: 'number missing'
        })

    } else if (persons.map(p => p.name.toLowerCase().trim()).includes(body.name.toLowerCase().trim())) {
        response.status(400).json({
            error: 'name must be unique'
        })
    } else {
    const person = {
        id: Math.floor(Math.random()*1000),
        name: body.name, 
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
    }

})

//middleware for catching + dealing with error requests made to non-existent routes
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
