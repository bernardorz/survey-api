import config from '../../../config/env'


import { Controller } from '../../../../presentation/protocols'
import { LoginController} from '../../../../presentation/controllers/login/login-controller'
import { DbAuthentication } from '../../../../data/usecases/authentication/db-authentication'

import { AccountMongoRepository} from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter} from '../../../../infra/cryptography/bcrypter-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../../infra/cryptography/jwt-adapter/jwt-adapter'
import {LoggerMongoRepository } from '../../../../infra/db/mongodb/log/log-mongo-repository'
import { makeLoginValidation } from './login-validation-factory'
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator'

export const makeLoginController = (): Controller => {
  const accountDbRepository  = new AccountMongoRepository()
  const bcryptAdapter = new BcryptAdapter(12)
  const jwtAdapter = new JwtAdapter(config.jwtSecret)
  const dbAuthentication = new DbAuthentication(accountDbRepository, bcryptAdapter, jwtAdapter, accountDbRepository)
  const loggerMongoRepository = new LoggerMongoRepository()

  const validationComposite = makeLoginValidation()
  const loginController = new LoginController(dbAuthentication, validationComposite)
   
 return new LogControllerDecorator(loginController, loggerMongoRepository)
}
