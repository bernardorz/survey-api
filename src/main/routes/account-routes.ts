import { Router } from 'express'
import { makeSignUpController } from '../factories/controllers/signup/signup-factory'
import { makeLoginController } from '../factories/controllers/login/login-factory'
import { adaptRoute } from '../adapters/express/express-route-adapter'

export default (router: Router) : void => {
    router.post('/signup', adaptRoute(makeSignUpController()))
    router.post('/login', adaptRoute(makeLoginController()))
}