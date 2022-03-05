import { SignUpController } from '../../presentation/controllers/signup/signup-controller'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { DbAddAcount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import {  AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { Controller  } from '@/presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'
import { LoggerMongoRepository } from '../../infra/db/mongodb/log-repository/log'

export const makeSignUpController = () : Controller => {
    const emailValidatorAdapter = new EmailValidatorAdapter()
    const bcryptAdapter = new BcryptAdapter(12)
    const addAcountRepository = new AccountMongoRepository() 
    const dbAddAcount = new DbAddAcount(bcryptAdapter, addAcountRepository)
    const signUpController = new SignUpController(emailValidatorAdapter, dbAddAcount)
    const loggerMongoRepository = new LoggerMongoRepository();
    return new LogControllerDecorator(signUpController, loggerMongoRepository)
}