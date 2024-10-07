const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname,'..', 'dist')))

morgan.token('data',(req, res)=>{
  const {id, ...filteredObj} = req.body
  return req.body ? (JSON.stringify(req.body.name), JSON.stringify(filteredObj)) : ' '
})

app.use(morgan(':method :url :status :res[content-length]- :response-time ms :data'))

let persons = [
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


// app.get('/', (request, response) => {
//   response.send(`<h1>Hello World</h1>`)
// })

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  
  person ? response.json(person) : response.status(404).send('resource not found')
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  
  response.status(204).end()
})


app.post('/api/persons', (request, response) => {
  const id= Date.now() + Math.floor(Math.random() * 1000)
  const {name, number} = request.body
  const newPerson = {
    name: name,
    number:number,
    id: id.toString()
  }  
  console.log(request.body.name);
  
  if(!name || !number){
    response.status(400).send({error: 'values should not be empty'})
  }
  else if(persons.find((person)=>person.name.toLowerCase() === name.toLowerCase())){
    response.status(400).send({error: 'Name must be unique!'})
  }
  else{
    persons = persons.concat(newPerson)
    response.json(persons)
  }
  
})

app.get('*',(request, response)=>{
  response.sendFile(path.join(__dirname,'..','dist','index.html'))
})

const port = process.env.PORT || 3001;
app.listen(port)
console.log(`server running on port ${port}`)





// https://phonebook-1ghvrvyh2-nandini-dixits-projects.vercel.app/