import { MongoHelper as sut } from "./mongo-helper"
import env from '../../../../main/config/env'

describe('Mongo Helper', () => {
    beforeAll(async () => {
        await sut.connect(env.mongoUrl)
    })

    afterAll(async () => {
        await sut.disconnect()
    })

    test('Should recconect if mongodb is down', async () => {
    
        let accountCollection = await sut.getCollection('accounts')

        expect(accountCollection).toBeTruthy()
        await sut.disconnect()

        accountCollection = await sut.getCollection('accounts')
        expect(accountCollection).toBeTruthy()
        
    })

})