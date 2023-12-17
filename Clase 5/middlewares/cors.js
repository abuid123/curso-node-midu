import cors from 'cors'

const ACCEPTED_ORIGINS = ['http://localhost:8080', 'http://localhost:1234']

export const corsMiddleware = ({ accepterOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin, callback) => {
    if (accepterOrigins.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) { return callback(null, true) }

    return callback(new Error('Not allowed by CORS'))
  }
})
