import { Express, Router } from 'express'
import fg from 'fast-glob'
import { readdirSync } from 'fs'

export default (app: Express): void => {
    const router = Router()
    app.use('/api',router)

    readdirSync(`${__dirname}/../routes`).map(async file => {
       if(!file.includes('.test.') && !file.includes('.spec.')){
        (await import(`../routes/${file}`)).default(router)
       }
    })
}