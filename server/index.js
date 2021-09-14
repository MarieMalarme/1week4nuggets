const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.port || 5000

const fs = require('fs')
const util = require('util')
const path = require('path')

const read_file = util.promisify(fs.readFile)
const write_file = util.promisify(fs.writeFile)
const body_parser = require('body-parser')

app.use(body_parser.json())
app.use(body_parser.urlencoded({ extended: false }))
app.use(cors())

app.get('/', (req, res, next) => {
  console.log('hello')
})

app.listen(port, () => {
  console.log(`server listening at http://localhost:${port}`)
})
