import express from 'express'
import http from 'http'

import { setupWSServer } from './helpers/cangjieSocketServerHelper.mjs'

import pages from './routes/pages.mjs'
import api from './routes/api.mjs'

const app = express()
const { static: expressStatic } = express
const port = normalizePort(process.env.PORT || '3000')

app.use((_req, res, next) => {
  res.pageData = {
    config: {}
  }

  next()
})

app.set('port', port)
app.set('view engine', 'ejs')

app.use(expressStatic('public'))
app.use(express.json())

app.use('/', pages)
app.use('/api', api)

const server = http.createServer(app)

setupWSServer(app, server)

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

function normalizePort(val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    return val
  }

  if (port >= 0) {
    return port
  }

  return false
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

  switch (error.code) {
    case 'EACCESS':
      console.error(`${bind} requires elevated privileges`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`)
      process.exit(1)
      break
    default:
      throw error
  }
}

function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
  console.info(`Listening on ${bind}`)
}
