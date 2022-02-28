import { AddAcount, AddAcountModel} from '../../../domain/usecases/add-account'
import { AccountModel } from '../../../domain/models/account'
import { Encrypter } from 'data/protocols'

export class DbAddAcount implements AddAcount{

    constructor(
        private readonly encrypter: Encrypter
    ){

    }
    async add(account: AddAcountModel): Promise<AccountModel>{
            const hashedPassword = await this.encrypter.encrypt(account.password)
            const mockedAccount = {} as AccountModel
            return new Promise(resolve => resolve(mockedAccount))
    }
}