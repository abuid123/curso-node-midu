const express = require('express')
const movies = require('./movies.json')
const cors = require('cors')
const crypto = require('node:crypto')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')

const app = express()
app.disable('x-powered-by')
app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = ['http://localhost:8080', 'http://localhost:1234']
    if (ACCEPTED_ORIGINS.includes(origin)) {
      callback(null, true)
      return
    }
    callback(new Error('Not allowed by CORS'))
  }
}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Todos los recursos que son Movies se identifican con /movies
app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
    return res.json(filteredMovies)
  }
  res.json(movies)
})

app.get('/movies/:id', (req, res) => { // path-to-regexp
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)
  res.status(404).json({ message: 'Movie not found' })
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(400).json({ message: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(), // Universal Unique IDentifier
    ...result.data
  }

  // Esto no seria REST, porque estamos guardando
  // la información en el servidor
  movies.push(newMovie)

  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (!movie) return res.status(404).json({ message: 'Movie not found' })

  const result = validatePartialMovie(req.body)

  if (result.error) {
    return res.status(400).json({ message: JSON.parse(result.error.message) })
  }

  const updatedMovie = {
    ...movie,
    ...result.data
  }

  movies.splice(movies.indexOf(movie), 1, updatedMovie)

  res.json(updatedMovie)
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (!movie) return res.status(404).json({ message: 'Movie not found' })

  movies.splice(movies.indexOf(movie), 1)

  res.status(204).end()
})

const PORT = process.env.PORT || 1234

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})
