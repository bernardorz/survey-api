import { AddAcount, AddAcountModel, Encrypter, AccountModel, AddAccountRepository} from './db-add-account-protocols'

export class DbAddAcount implements AddAcount{

    constructor(
        private readonly encrypter: Encrypter,
        private readonly addAcountRepository: AddAccountRepository
    ){

    }
    async add(accountData: AddAcountModel): Promise<AccountModel>{
            const hashedPassword = await this.encrypter.encrypt(accountData.password)
            const createAccount = await this.addAcountRepository.add(Object.assign({},accountData, { password: hashedPassword}))
            return createAccount
    }
}