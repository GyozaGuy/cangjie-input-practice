export async function json(endpoint, options = {}) {
  const response = await fetch(endpoint, options)
  return response.json()
}

export default {
  json
}
