#!/usr/bin/env node
import { Nod3 } from '../classes/Nod3'

const URL_ARG_NAME = 'NOD3_CLI_URL'

const command = process.argv[2]
if (!command) help()
const curlOption = '--curl'
const curl = process.argv.find(v => v === curlOption)
let url = process.argv.find(v => /^https?:\/\//.test(v))
url = url || process.env[URL_ARG_NAME] || 'http://localhost:4444'
const Provider = (curl) ? Nod3.providers.CurlProvider : Nod3.providers.HttpProvider
const nod3 = new Nod3(new Provider(url))
exec(command)

async function exec (command) {
  try {
    const { module, action, params } = parseCommand(command)
    if (!module || !action) help()
    if (!nod3[module]) throw new Error(`Unknown module: ${module}`)
    let result = await nod3[module][action](...params)
    result = (typeof result !== 'string') ? JSON.stringify(result, null, 2) : result
    console.log(result)
    process.exit(0)
  } catch (err) {
    console.error(`${err}`)
    process.exit(9)
  }
}

function help () {
  const name = process.argv[1].split('/').pop()
  console.log('Usage:')
  console.log(` ${name} command [options] [url]`)
  console.log()
  console.log(`Options:`)
  console.log(`  --curl: returns curl command instead of result`)
  console.log()
  console.log('Example:')
  console.log(` ${name} eth.getBlock[200]`)
  console.log(`To avoid to type the url, you can set it in the environment variable: ${URL_ARG_NAME}`)
  process.exit(0)
}

function parseCommand (cmd) {
  try {
    let [module, args] = cmd.split('.')
    let [action, params] = args.split('[')
    params = params.replace(/\]/g, '')
    params = (params) ? params.split(',') : []
    return { module, action, params }
  } catch (err) {
    help()
  }
}

process.on('uncaughtException', err => {
  console.error(err)
  process.exit(9)
})
