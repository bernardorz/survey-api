import { Express } from 'express'
import { cors, contentType, bodyParser } from '../middlewares/'


export default (app: Express): void => {
    app.use(bodyParser)
    app.use(cors)
    app.use(contentType)
}