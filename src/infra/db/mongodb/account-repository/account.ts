import { AccountModel } from 'domain/models/account'
import { AddAcountModel } from 'domain/usecases/add-account'
import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { MongoHelper } from '../helpers/mongo-helper'


export class AccountMongoRepository implements AddAccountRepository{
    public async add(accountData: AddAcountModel): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const result = await accountCollection.insertOne(accountData)
        const account = MongoHelper.map(result.ops[0])
        return account
    }
}