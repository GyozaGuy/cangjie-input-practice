import ws from 'ws'

const WSServer = ws.Server

const channels = {
  public: []
}
const listeners = []

export function createWSServer(server) {
  const wss = new WSServer({ server })

  wss.on('connection', ws => {
    // Setup ping/pong
    ws.isAlive = true

    ws.on('pong', () => (ws.isAlive = true))

    ws.on('error', error => {
      console.error(error)
    })

    ws.on('message', messageObj => {
      const { channel, message, data, responseId } = JSON.parse(messageObj)

      if (channel && message === 'JOIN_CHANNEL') {
        if (!channels[channel]) {
          channels[channel] = []
        }

        Object.values(channels).forEach(value => {
          if (value.includes(ws)) {
            value.splice(value.indexOf(ws), 1)
          }
        })

        if (!channels[channel].includes(ws)) {
          channels[channel].push(ws)
        }
      } else {
        const currentChannel = Object.keys(channels).find(channel => channels[channel].includes(ws))

        if (currentChannel) {
          channels[currentChannel]
            .filter(client => client !== ws)
            .forEach(client => {
              client.send(JSON.stringify({ message, data }))
            })

          listeners.forEach(async listener => {
            if (listener.message === message) {
              if (responseId) {
                ws.send(JSON.stringify({ message: responseId, data: await listener.cb(data) }))
              } else {
                ws.send(JSON.stringify({ message, data: await listener.cb(data) }))
              }
            }
          })
        }
      }
    })
  })

  wss.onMessage = (message, cb) => {
    listeners.push({ message, cb })
  }

  setInterval(() => {
    wss.clients.forEach(ws => {
      if (!ws.isAlive) {
        return ws.terminate()
      }

      ws.isAlive = false
      ws.ping(() => {})
    })
  }, 30000)

  return wss
}

export default {
  createWSServer
}
