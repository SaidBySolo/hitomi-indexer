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

const bytesStart = (config.page - 1) * config.item * 4
const bytesEnd = bytesStart + config.item * 4 - 1

switch (config.mode) {
  case 'index': {
    fetchIndex({
      domain: config.domain,
      indexFile: config.indexFile,
      userAgent: config.userAgent,
      bytesStart,
      bytesEnd
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
