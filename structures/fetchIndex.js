const fetch = require('node-fetch')

const fetchIndex = async (opts = {}) => {
  const bytesStart = (opts.page - 1) * opts.item * 4
  const bytesEnd = bytesStart + opts.item * 4 - 1

  const items = []

  const response = await fetch(`http://ltn.${opts.domain}/${opts.indexFile}`, {
    headers: {
      'User-Agent': opts.userAgent,
      Range: `bytes=${bytesStart}-${bytesEnd}`,
      referer: `https://${opts.domain}/index-all-${opts.page}.html`,
      origin: `http://${opts.domain}`
    },
    agent: opts.agent
  })
  const buffer = await response.arrayBuffer()

  const interface = new DataView(buffer)
  const totalItems = interface.byteLength / 4

  for (let i = 0; i < totalItems; i++) {
    items.push(interface.getInt32(i * 4, false /* big endian */))
  }

  return items
}

module.exports = fetchIndex
