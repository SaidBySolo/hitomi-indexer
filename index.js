#!/usr/bin/env node

const HttpsProxyAgent = require('https-proxy-agent')

const {
  argvParser,
  fetchIndex
} = require('./structures')
const translations = require('./translations')
const config = require('./config')

String.prototype.bind = function (parameters) {
  let text = this
  const keys = text.match(/\{(.*?)\}/g)

  if (!keys) return this

  for (let i = 0; i < keys.length; i++) {
    const keyname = keys[i].replace('{', '').replace('}', '')

    text = text.replace(keys[i], parameters[keyname] || '')
  }

  return text
}

const opts = {}

console.log('[Info] parsing the given command line arguments')

const argv = argvParser(process.argv.slice(2))
const argvKeys = Object.keys(argv)

for (let i = 0, l = argvKeys.length; i < l; i++) {
  const key = argvKeys[i]

  config[key] = argv[key] || config[key]

  console.log(`[Info/Config] applying config '${key}': '${config[key]}'`)
}

if (config.language.length == 2 && config.language in translations) {
  console.log('[Info/Translation] using the given language instead of default')

  translations._active = translations[config.language]
} else {
  console.log('[Info/Translation] the given language is not supported yet')

  translations._active = translations.en
}

const translation = translations._active

console.log(translation.mainStartUp)
console.log(config)

let agent

if (config.proxy) {
  console.log(translation.mainAppliedProxy.bind({ proxyURL: config.proxy }))

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
      .then(items => console.log(translation.mainIndexResult.bind({ result: items.join(', ') })))

    break
  }
  default:
    console.log(translation.mainInvalidMode)
}
