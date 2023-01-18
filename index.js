import express from 'express'
import 'express-async-errors'

import config from 'config'

const app = express()
app.use(express.json())

import './db.js'
import appFunc from './routes.js';
 appFunc(app)

const port = config.get('port')
const server = app.listen(port, () => console.log(`Listening on port ${port}...`))



export {app, server}