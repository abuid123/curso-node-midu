const ditto = require('./pokemon/ditto.json')
const express = require('express')
const app = express()

app.disable('x-powered-by')
app.use(express.json())

const PORT = process.env.PORT ?? 1234

// app.use((req, res, next) => {
//   if (req.method !== 'POST') return next()
//   if (req.headers['content-type'] !== 'application/json') return next()

//   // Solo llegan aca las que son POST y tienen content-type: application/json

//   let body = ''

//   // escuchar el evento data
//   req.on('data', (chunk) => {
//     body += chunk.toString()
//   })

//   req.on('end', () => {
//     const data = JSON.parse(body)
//     data.timestamp = Date.now()
//     // mutar la request y meter la informacion en la req.body
//     req.body = data
//     next()
//   })
// })

app.get('/pokemon/ditto', (req, res) => {
  res.json(ditto)
})

app.post('/pokemon', (req, res) => {
  res.status(201).json(req.body)
})

app.use((req, res) => {
  res.status(404).send('<h1>404 NOT FOUND</h1>')
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
