const ssl = location.protocol === 'https:'

export function connect() {
  return new Promise((resolve, reject) => {
    try {
      const id = `socket_${generateId()}`
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
          } else {
            // NOTE: execution should only get here if helperObject.get() was used
            socketListeners[message](data)
          }
        })

        const helperObject = {
          disconnect() {
            socket.close()
          },
          emit(message, data) {
            socket.send(JSON.stringify({ id, message, data }))
          },
          get(message, data) {
            return new Promise(resolve => {
              const responseId = generateId()
              socketListeners[responseId] = data => {
                delete socketListeners[responseId]
                resolve(data)
              }
              socket.send(JSON.stringify({ id, message, data, responseId }))
            })
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

function generateId() {
  return Math.random()
    .toString(36)
    .substr(2, 9)
}

export default {
  connect
}
