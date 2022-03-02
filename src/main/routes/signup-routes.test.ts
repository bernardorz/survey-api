import request from 'supertest'

import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'


describe('SignUp Routes', () => {

    beforeAll( async () => {
        await MongoHelper.connect(global.__MONGO_URI__)
    })

    afterAll( async () => {
        await MongoHelper.disconnect()
    })

    beforeEach( async() => {
        const accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })

    test('Should return an account on sucess', async () => {
        await request(app)
            .post('/api/signup')
            .send({
                name: "Bernardo",
                email: "bernardorizzatti01@gmail.com",
                password: "123",
                passwordConfirmation: "123"
            })
            .expect(200)
    })
})