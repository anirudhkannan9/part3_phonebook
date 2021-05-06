//import Mongoose; 'object-document mapper' library that helps save JS objects as Mongo docs
const mongoose = require('mongoose')

//password: ak12ak12 (not the same as my MongoDB Atlas account password; this is just to access the dbs programatically)
if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.22slg.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true, useCreateIndex: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    //find and print to console all the people in the fucking erm database
    Person
        .find({})
        .then(result => {
            console.log('phonebook:')
            result.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
        })
} else {
    const name =  process.argv[3]
    const number = process.argv[4]
    const person = new Person({
        name: name,
        number: number
    })
    person
        .save()
        .then(result => {
            console.log(`Added ${name} number ${number} to phonebook`)
            mongoose.connection.close()
        })

}