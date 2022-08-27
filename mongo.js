const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.fyatk0e.mongodb.net/?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })

const Person = mongoose.model('Person', personSchema)

mongoose.connect(url)
    .then((result) => {
        console.log('connected')
        if (process.argv.length > 3) {
            const person = new Person({
                name: process.argv[3],
                number: process.argv[4]
            })
            console.log(`added ${person.name} ${person.number} to phonebook`)
            person.save().then(result => mongoose.connection.close() )
        } else {
            console.log('phonebook:')
            Person.find({}).then(result => {
                result.forEach(person => {
                    console.log(`${person.name} ${person.number}`)
                })
            return mongoose.connection.close()
            })
        }
    })
    .catch((err) => console.log(err))

      


 
    



  
