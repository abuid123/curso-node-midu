const http = require('node:http')
const fs = require('node:fs')

const desiredPort = process.env.PORT ?? 1234

const processRequest = (req, res) => {
  res.setHeader('Content-Type', 'text/html')
  if (req.url === '/') {
    res.statusCode = 200
    res.end('Bienvenido a mi pagina de Inicio')
  } else if (req.url === '/imagen-godines.jpg') {
    fs.readFile('./coscu.jpg', (err, data) => {
      if (err) {
        res.statusCode = 500
        res.end('<h1>500 Error interno del Servidor</h1>')
      } else {
        res.setHeader('Content-Type', 'image/jpeg')
        res.statusCode = 200
        res.end(data)
      }
    })
  } else if (req.url === '/contacto') {
    res.statusCode = 200
    res.end('Bienvenido a mi pagina de Contacto')
  } else {
    res.statusCode = 404
    res.end('<h1>No se encontro la pagina</h1>')
  }
}

const server = http.createServer(processRequest)

server.listen(desiredPort, () => {
  console.log(`Server listening on port http://localhost:${desiredPort}`)
})
