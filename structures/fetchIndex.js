const fetch = require('node-fetch')

const fetchIndex = async (opts = {}) => {
  const items = []

  const response = await fetch(`http://${opts.domain}/${opts.indexFile}`, {
    headers: {
      'User-Agent': opts.userAgent,
      Range: `bytes=${opts.bytesStart}-${opts.bytesEnd}`
    }
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
