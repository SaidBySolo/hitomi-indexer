#!/usr/bin/env node

const HttpsProxyAgent = require('https-proxy-agent')

const {
  argvParser,
  fetchIndex
} = require('./structures')
const config = require('./config')

const opts = {}

const argv = argvParser(process.argv.slice(2))
const argvKeys = Object.keys(argv)

for (let i = 0, l = argvKeys.length; i < l; i++) {
  const key = argvKeys[i]

  config[key] = argv[key] || config[key]
}

let agent

if (config.proxy) {
  agent = new HttpsProxyAgent(config.proxy)
}

console.log(config)

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
      .then(items => {
        for (let i = 0; i < items.length; i++) {
          console.log(items[i])
        }
      })

    break
  }
  default:
    console.log('ERR: invalid mode argument passed!')
}
