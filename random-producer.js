'use strict'

const { Readable } = require('stream')
const { Client } = require('./')
const client = new Client({ node: 'http://localhost:9200' })

const b = client.helpers.bulk({
  datasource: buildDatasource(10),
  flushBytes: 'auto',
  onDocument (doc) {
    return {
      index: { _index: 'test' }
    }
  }
})

b.then(console.log).catch(console.log)

function buildDatasource (interval) {
  const stream = new Readable({
    objectMode: true,
    read (size) {}
  })

  setTimeout(onTimeout, 10)

  function onTimeout () {
    stream.push(buildDocument())
    setTimeout(onTimeout, Math.random() > 0.8 ? 10 : 5)
  }

  function randomInt (minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
  }

  function buildDocument () {
    const doc = {}
    for (let i = 0; i < randomInt(1, 500); i++) {
      doc[`key-${i}`] = `val-${i}`
    }
    return doc
  }

  return stream
}
