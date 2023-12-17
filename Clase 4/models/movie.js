import { readJSON } from '../utils.js'
import { randomUUID } from 'node:crypto'
const movies = readJSON('./movies.json')

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      return movies.filter(
        movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
      )
    }
    return movies
  }

  static async getById (id) {
    return movies.find(movie => movie.id === id)
  }

  static async create (movie) {
    const newMovie = {
      id: randomUUID(), // Universal Unique IDentifier
      ...movie.data
    }

    // Esto no seria REST, porque estamos guardando
    // la información en el servidor
    movies.push(newMovie)

    return newMovie
  }

  static async delete (id) {
    const movie = movies.find(movie => movie.id === id)
    if (!movie) return false

    movies.splice(movies.indexOf(movie), 1)

    return true
  }

  static async update ({ movie, input }) {
    console.log(input)
    const updatedMovie = {
      ...movie,
      ...input
    }

    movies.splice(movies.indexOf(movie), 1, updatedMovie)

    return updatedMovie
  }
}
