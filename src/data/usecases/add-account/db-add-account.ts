import { AddAcount, AddAcountModel, Hasher, AccountModel, AddAccountRepository} from './db-add-account-protocols'

export class DbAddAcount implements AddAcount{

    constructor(
        private readonly hasher: Hasher,
        private readonly addAcountRepository: AddAccountRepository
    ){

    }
    async add(accountData: AddAcountModel): Promise<AccountModel>{
            const hashedPassword = await this.hasher.hash(accountData.password)
            const createAccount = await this.addAcountRepository.add(Object.assign({},accountData, { password: hashedPassword}))
            return createAccount
    }
}