import ws from 'ws'

const WSServer = ws.Server

const channels = {
  public: []
}

export function createWSServer(server) {
  const wss = new WSServer({ server })

  wss.on('connection', ws => {
    ws.on('error', error => {
      console.error(error)
    })

    ws.on('message', messageObj => {
      const { channel, message, data } = JSON.parse(messageObj)

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
        }
      }
    })
  })
}

export default {
  createWSServer
}
