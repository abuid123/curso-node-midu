import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: 'Pipitequiero10',
  database: 'moviesdb'
}

const connection = await mysql.createConnection(config)

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()

      // get genre ids from database table using genre names
      const [genres] = await connection.query(
        'select id, name from genres where LOWER(name) = ?;', [lowerCaseGenre]
      )

      // no genre found
      if (genres.length === 0) {
        throw new Error('Genre not found')
      }

      // get the id from the first genre result
      const [{ id }] = genres

      // get all movies ids from database table
      const [movieId] = await connection.query(
        'select BIN_TO_UUID(movie_id) as id from movies_genres where genre_id = ?;', [id]
      )

      const moviesIds = movieId.map(({ id }) => id)

      const [movies] = await connection.query(
        'select title, year, director, duration, poster, rate, BIN_TO_UUID(id) as id from movies where id = UUID_TO_BIN(?);',
        [moviesIds]
      )

      console.log(movies)
      return movies
    }

    const [movies] = await connection.query(
      'select title, year, director, duration, poster, rate, BIN_TO_UUID(id) as id from movies;'
    )

    console.log(movies)
  }

  static async getById (id) {
    const [movies] = await connection.query(
      'select title, year, director, duration, poster, rate, BIN_TO_UUID(id) as id from movies where id = UUID_TO_BIN(?);',
      [id]
    )

    if (movies.length === 0) {
      throw new Error('Movie not found')
    }

    return movies[0]
  }

  static async create ({ input }) {
    const {
      genre: genreInput,
      title,
      year,
      director,
      duration,
      rate,
      post
    } = input

    const [uuidResult] = await connection.query('select UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(
        'insert into movies (id,title, year, director, duration, rate, poster) values (UUID_TO_BIN(?),?, ?, ?, ?, ?, ?);',
        [uuid, title, year, director, duration, rate, post]
      )
    } catch (error) {
      // puede enviarle informacion sensible al usuario
      throw new Error('Error creating movie')
    }

    const [movies] = await connection.query(
      'select title, year, director, duration, poster, rate, BIN_TO_UUID(id) as id from movies where id = UUID_TO_BIN(?);',
      [uuid]
    )

    return movies[0]
  }

  static async delete (id) {

  }

  static async update ({ movie, input }) {

  }
}
