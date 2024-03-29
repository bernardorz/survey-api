import { AddAcount, AddAcountModel, Hasher, AccountModel, AddAccountRepository, LoadAccountByEmailRepository} from './db-add-account-protocols'

export class DbAddAcount implements AddAcount{

    constructor(
        private readonly hasher: Hasher,
        private readonly addAcountRepository: AddAccountRepository,
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
    ){

    }
    async add(accountData: AddAcountModel): Promise<AccountModel>{

            const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)

            if(!account){
                const hashedPassword = await this.hasher.hash(accountData.password)
                const createAccount = await this.addAcountRepository.add(Object.assign({},accountData, { password: hashedPassword}))
                return createAccount
            }

            return null
            
            
    }
}