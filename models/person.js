const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => {
    console.log('Connected to Database')
  })
  .catch(e => {
    console.log(`Couldn't connect to DB due to ${e}.`)

  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Person"s name is required!'],
    minLength: 3
  },
  number: {
    type: String,
    required: [true, 'Person"s phone number is reqired!'],
    minLength: 8,
    validate: {
      validator: (number) => {
        return /^\d{2,3}-\d+$/.test(number)
      },
      message: () => 'The phone number should be in (123-123456) format and alteast 8 digits long!'
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)