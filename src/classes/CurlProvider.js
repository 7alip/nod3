import { Provider } from './Provider'

export class CurlProvider extends Provider {
  constructor (url, options = {}) {
    super(url, options)
    this.client = Client(url)
  }

  send (payload) {
    let { id, jsonrpc } = payload
    let headers = { 'Content-Type': 'application/json' }
    let result = this.client.post(payload, { headers })
    return { result, id, jsonrpc }
  } catch (err) {
    return Promise.reject(err)
  }
}

function Client (url) {
  const curlHeaders = headers => Object.entries(headers).map(h => `-H "${h[0]}":"${h[1]}"`).join(' ')

  const makeCurlCommand = ({ data, headers, method } = {}) => {
    let cmd = ['curl']
    if (headers) cmd.push(curlHeaders(headers))
    if (method) cmd.push(`-X ${method}`)
    data = (data && typeof data !== 'string') ? JSON.stringify(data) : data
    if (data) cmd.push(`-d '${data}'`)
    cmd.push(url)
    return cmd.join(' ')
  }

  const post = (data, { headers } = {}) => makeCurlCommand({ method: 'POST', headers, data })

  return Object.freeze({ post })
}

export default CurlProvider
