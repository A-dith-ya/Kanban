const express = require('express')
require('./db/mongoose')
const path = require('path')
const accountRouter = require('./routers/account')
const todoRouter = require('./routers/todo')

const app = express()
const port = process.env.PORT

app.use(express.static(path.join(__dirname, '../frontend/build')))
app.use(express.json())  // Parse incoming json into object
app.use('/account', accountRouter)
app.use('/todo', todoRouter)


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../frontend/build/index.html'))
})

module.exports = app
