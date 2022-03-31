import { AccountModel } from 'domain/models/account'
import { AddAcountModel } from 'domain/usecases/add-account'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository'
import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { MongoHelper } from '../helpers/mongo-helper'


export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository{
    public async add(accountData: AddAcountModel): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const result = await accountCollection.insertOne(accountData)
        const account = MongoHelper.map(result.ops[0])
        return account
    }

    public async loadByEmail(email: string): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts')
        const account = await accountCollection.findOne({ email })
        return account && MongoHelper.map(account)
    }
}