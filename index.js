const express = require('express')
//built-in library to make using Node's http module easier to use and scale
const app = express()

const persons = [
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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
