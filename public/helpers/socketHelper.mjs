const ssl = location.protocol === 'https:'

export function connect() {
  return new Promise((resolve, reject) => {
    try {
      const id = `socket_${Math.random()
        .toString(36)
        .substr(2, 9)}`
      const socket = new WebSocket(`ws${ssl ? 's' : ''}://${location.host}`)
      const socketListeners = {}

      socket.addEventListener('open', () => {
        socket.addEventListener('error', error => {
          console.error(error)
        })

        socket.addEventListener('message', ({ data: messageObj }) => {
          const { message, data } = JSON.parse(messageObj)

          if (Array.isArray(socketListeners[message])) {
            socketListeners[message].forEach(listener => {
              listener(data)
            })
          }
        })

        const helperObject = {
          disconnect() {
            socket.close()
          },
          emit(message, data) {
            socket.send(JSON.stringify({ id, message, data }))
          },
          join(targetChannel = 'public') {
            socket.send(JSON.stringify({ channel: targetChannel, id, message: 'JOIN_CHANNEL' }))
          },
          on(message, cb) {
            if (!socketListeners[message]) {
              socketListeners[message] = []
            }

            socketListeners[message].push(cb)
          }
        }

        helperObject.join()

        resolve(helperObject)
      })
    } catch (err) {
      reject(err)
    }
  })
}

export default {
  connect
}
