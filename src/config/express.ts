import express from 'express'
import path from 'path'
import exceptionHandler from 'express-exception-handler'
exceptionHandler.handle()
const app = express()
import * as error from '../api/middlewares/error'
import tokenCheck from '../api/middlewares/tokenCheck'
import config from './config'

app.use(express.json())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../api/views'))

import { initDatabaseService } from '../api/service/database'
initDatabaseService(app)
import { initInstanceService } from '../api/service/instance'
initInstanceService(app)

import routes from '../api/routes/'
if (config.protectRoutes) {
    app.use(tokenCheck)
}
app.use('/', routes)
app.use(error.handler)

export default app
