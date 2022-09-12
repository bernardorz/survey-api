import config from '../../../config/env'


import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller'
import { DbAddAcount } from '../../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../../infra/cryptography/bcrypter-adapter/bcrypt-adapter'
import {  AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { Controller  } from '../../../../presentation/protocols'
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator'
import { makeSignUpValidation } from './signup-validation-factory'
import { DbAuthentication } from '../../../../data/usecases/authentication/db-authentication'
import { JwtAdapter } from '../../../../infra/cryptography/jwt-adapter/jwt-adapter'
import {LoggerMongoRepository } from '../../../../infra/db/mongodb/log/log-mongo-repository'



export const makeSignUpController = () : Controller => {
    const accountDbRepository  = new AccountMongoRepository()
    const bcryptAdapter = new BcryptAdapter(12)
    const jwtAdapter = new JwtAdapter(config.jwtSecret)
    const dbAuthentication = new DbAuthentication(accountDbRepository, bcryptAdapter, jwtAdapter, accountDbRepository)
    const dbAddAcount = new DbAddAcount(bcryptAdapter, accountDbRepository, accountDbRepository) 
    const signUpController = new SignUpController(dbAddAcount, makeSignUpValidation(), dbAuthentication)
    const loggerMongoRepository = new LoggerMongoRepository() 
    
    return new LogControllerDecorator(signUpController, loggerMongoRepository)
}