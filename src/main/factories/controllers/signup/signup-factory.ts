import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller'
import { DbAddAcount } from '../../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../../infra/cryptography/bcrypter-adapter/bcrypt-adapter'
import {  AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { Controller  } from '../../../../presentation/protocols'
import { LogControllerDecorator } from '../../../decorators/log-controller-decorator'
import { LoggerMongoRepository } from '../../../../infra/db/mongodb/log/log-mongo-repository'
import { makeSignUpValidation } from './signup-validation-factory'

export const makeSignUpController = () : Controller => {
    const bcryptAdapter = new BcryptAdapter(12)
    const addAcountRepository = new AccountMongoRepository() 
    const dbAddAcount = new DbAddAcount(bcryptAdapter, addAcountRepository) 
    const signUpController = new SignUpController(dbAddAcount, makeSignUpValidation())
    const loggerMongoRepository = new LoggerMongoRepository() 
    return new LogControllerDecorator(signUpController, loggerMongoRepository)
}