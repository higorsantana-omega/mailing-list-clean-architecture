/* eslint-disable node/no-path-concat */
import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import { join } from 'path'

export default (app: Express): void => {
  const router = Router()
  readdirSync(join(__dirname, '../routes')).map(async file => {
    return import(join(__dirname, '../routes', file))
      .then(route => route.default(router))
      .catch((error) => console.log(error))
  })
  app.use('/api', router)
}
