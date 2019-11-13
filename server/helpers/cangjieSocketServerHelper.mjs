import cangjie from 'zh-cangjie'

import { createWSServer } from './websocketServer.mjs'
import characterLists from './characterLists.json'

const { findCharacters, forCharacter, toCangjie } = cangjie

export function setupWSServer(app, server) {
  app.wss = createWSServer(server)

  app.wss.onMessage('getCharacterLists', () => {
    return Object.keys(characterLists)
  })

  app.wss.onMessage('getCharacters', async letters => {
    const characters = await findCharacters(letters)
    return { cangjie: toCangjie(letters), characters: characters.slice(0, 10) }
  })

  app.wss.onMessage('getRandomCharacter', async lists => {
    let characterPool

    if (lists) {
      characterPool = Object.entries(characterLists).reduce((acc, [name, list]) => {
        if (lists.includes(name)) {
          return [...acc, ...list.split('')]
        }

        return acc
      }, [])
    } else {
      characterPool = Object.entries(characterLists).reduce((acc, [, list]) => {
        return [...acc, ...list.split('')]
      }, [])
    }

    const character = characterPool[Math.floor(Math.random() * characterPool.length)]
    const codes = await forCharacter(character)

    return { character, codes }
  })

  app.wss.onMessage('testCangjieForCharacter', async ({ character, code }) => {
    const { cangjie } = await forCharacter(character)
    return code === cangjie
  })
}

export default {
  setupWSServer
}
