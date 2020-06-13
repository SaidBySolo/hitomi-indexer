#!/usr/bin/env node

const HttpsProxyAgent = require('https-proxy-agent')

const {
  argvParser,
  fetchIndex
} = require('./structures')
const config = require('./config')

const opts = {}

console.log('[Info] parsing the given command line arguments')

const argv = argvParser(process.argv.slice(2))
const argvKeys = Object.keys(argv)

for (let i = 0, l = argvKeys.length; i < l; i++) {
  const key = argvKeys[i]

  config[key] = argv[key] || config[key]

  console.log(`[Info/Config] applying config '${key}': '${config[key]}'`)
}

console.log(`[Info/Config] starting with the following config`)
console.log(config)

let agent

if (config.proxy) {
  console.log(`[Info/Warning] '${config.proxy}' was provided as proxy url and the proxy will be used for requests`)

  agent = new HttpsProxyAgent(config.proxy)
}

switch (config.mode) {
  case 'index': {
    fetchIndex({
      domain: config.domain,
      indexFile: config.indexFile,
      userAgent: config.userAgent,
      page: config.page,
      item: config.item,
      agent
    })
      .then(items => console.log(`[Info/Result] indexed items: ${items.join(', ')}`))

    break
  }
  default:
    console.log('ERR: invalid mode argument passed!')
}
