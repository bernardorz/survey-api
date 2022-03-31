
import { Controller } from '../../../../presentation/protocols'
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator'
import { LoggerMongoRepository } from '../../../../infra/db/mongodb/log/log-mongo-repository'
import { LoginController } from '../../../../presentation/controllers/login/login-controller'
import { makeLoginValidation } from './login-validation-factory'

export const makeLoginController = (): Controller => {
  // const validationComposite = makeLoginValidation()
  // const loginController = new LoginController()
  // const loggerMongoRepository = new LoggerMongoRepository()
  // return new LogControllerDecorator(loginController, loggerMongoRepository)
  return { } as Controller
}
