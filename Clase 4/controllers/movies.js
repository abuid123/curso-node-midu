import { MovieModel } from '../models/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController {
  static async getAll (req, res) {
    const { genre } = req.query
    const movies = await MovieModel.getAll({ genre })

    res.json(movies)
  }

  static async getById (req, res) {
    const { id } = req.params
    const movie = await MovieModel.getById(id)
    if (movie) return res.json(movie)
    res.status(404).json({ message: 'Movie not found' })
  }

  static async create (req, res) {
    const result = validateMovie(req.body)

    if (result.error) {
      return res.status(400).json({ message: JSON.parse(result.error.message) })
    }

    const newMovie = await MovieModel.create(result.data)

    res.status(201).json(newMovie)
  }

  static async delete (req, res) {
    const { id } = req.params
    const movie = await MovieModel.delete(id)
    if (!movie) return res.status(404).json({ message: 'Movie not found' })

    res.status(200).json({ message: 'Movie deleted' })
  }

  static async update (req, res) {
    const { id } = req.params
    const movie = await MovieModel.getById(id)
    if (!movie) return res.status(404).json({ message: 'Movie not found' })

    const result = validatePartialMovie(req.body)

    if (result.error) {
      return res.status(400).json({ message: JSON.parse(result.error.message) })
    }

    const updatedMovie = await MovieModel.update({ movie, input: result.data })

    res.json(updatedMovie)
  }
}
