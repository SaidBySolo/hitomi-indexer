const argvParser = argv => {
  const opts = {}
  let currentOptsName
  let currentOptsData = []

  for (let i = 0, l = argv.length; i < l; i++) {
    const optPattern = /-(?:-)?([\w-]+)/i

    if (argv[i].startsWith('-')) {
      if (currentOptsName) {
        opts[currentOptsName] = currentOptsData.join(' ')
      }

      currentOptsName = optPattern.exec(argv[i])[1]
      currentOptsData = []
      opts[currentOptsName] = ''
    } else {
      currentOptsData.push(argv[i])

      if (argv.length === i + 1) {
        opts[currentOptsName] = currentOptsData.join(' ')
      }
    }
  }

  return opts
}

module.exports = argvParser
