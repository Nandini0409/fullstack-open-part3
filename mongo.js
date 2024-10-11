const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Provide password in the Command"s arguments.')
  process.exit(1)
}

const password = encodeURIComponent(process.argv[2])

const url = `mongodb+srv://nandinidixit0409:${password}@phonebookcluster.pz0vz.mongodb.net/?retryWrites=true&w=majority&appName=phonebookCluster`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4]
})

person.save().then(() => {
  console.log(`added ${person.name} number ${person.number} to phonebook.`)
  mongoose.connection.close()
})