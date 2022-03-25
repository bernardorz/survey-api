import { SignUpController } from '../../../../presentation/controllers/signup/signup-controller'
import { DbAddAcount } from '../../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter'
import {  AccountMongoRepository } from '../../../../infra/db/mongodb/account-repository/account'
import { Controller  } from '../../../../presentation/protocols'
import { LogControllerDecorator } from '../../../decorators/log'
import { LoggerMongoRepository } from '../../../../infra/db/mongodb/log-repository/log'
import { makeSignUpValidation } from './signup-validation'

export const makeSignUpController = () : Controller => {
    const bcryptAdapter = new BcryptAdapter(12)
    const addAcountRepository = new AccountMongoRepository() 
    const dbAddAcount = new DbAddAcount(bcryptAdapter, addAcountRepository) 
    const signUpController = new SignUpController(dbAddAcount, makeSignUpValidation())
    const loggerMongoRepository = new LoggerMongoRepository() 
    return new LogControllerDecorator(signUpController, loggerMongoRepository)
}