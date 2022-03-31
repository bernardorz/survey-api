import { AccountModel } from '../../../../domain/models/account'
import { AddAcountModel } from '../../../../domain/usecases/add-account'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository'
import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { UpdateAcessTokenRepository } from '../../../../data/protocols/db/account/update-acess-token-repository'


export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAcessTokenRepository{
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

    public async updateAcessToken(id: string, token: string): Promise<void>{
        const accountCollection = await MongoHelper.getCollection('accounts')

        await accountCollection.updateOne({_id: id}, {
            $set: {
                acessToken: token
            }
        })
        
    }
}