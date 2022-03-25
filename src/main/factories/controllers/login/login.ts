
import { Controller  } from '../../../../presentation/protocols'
import { LogControllerDecorator } from '../../../decorators/log'
import { LoggerMongoRepository } from '../../../../infra/db/mongodb/log-repository/log'
import { LoginController } from '../../../../presentation/controllers/login/login'
import { makeLoginValidation } from './login-validation'


export const makeLoginController = () : Controller => {

    // const validationComposite = makeLoginValidation()
    // const loginController = new LoginController()
    // const loggerMongoRepository = new LoggerMongoRepository() 
    // return new LogControllerDecorator(loginController, loggerMongoRepository)
    return { } as Controller
}