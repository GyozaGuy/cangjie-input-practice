import { connect } from './socketHelper.mjs'

let cachedSocket

export async function getCharacterLists() {
  const socket = await getSocket()
  return socket.get('getCharacterLists')
}

export async function getCharactersForCode(code) {
  const socket = await getSocket()
  return socket.get('getCharacters', code)
}

export async function getRandomCharacter(lists) {
  const socket = await getSocket()
  return socket.get('getRandomCharacter', lists)
}

async function getSocket() {
  if (cachedSocket) {
    return cachedSocket
  }

  cachedSocket = await connect() // eslint-disable-line require-atomic-updates
  return cachedSocket
}

export async function testCangjieForCharacter(code, character) {
  const socket = await getSocket()
  return socket.get('testCangjieForCharacter', { character, code })
}

export default {
  getCharacterLists,
  getCharactersForCode,
  getRandomCharacter,
  testCangjieForCharacter
}
