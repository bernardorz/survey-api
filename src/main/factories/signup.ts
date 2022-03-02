import { SignUpController } from '../../presentation/controllers/signup/signup-controller'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { DbAddAcount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import {  AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'

export const makeSignUpController = () : SignUpController => {
    const emailValidatorAdapter = new EmailValidatorAdapter()
    const bcryptAdapter = new BcryptAdapter(12)
    const addAcountRepository = new AccountMongoRepository() 
    const dbAddAcount = new DbAddAcount(bcryptAdapter, addAcountRepository)
    return new SignUpController(emailValidatorAdapter, dbAddAcount)
}