import request from 'supertest'

import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

let accountCollection: Collection

describe('SignUp Routes', () => {

    beforeAll( async () => {
        await MongoHelper.connect(process.env.MONGO_URL)
    })

    afterAll( async () => {
        await MongoHelper.disconnect()
    })

    beforeEach( async() => {
        accountCollection = await MongoHelper.getCollection('accounts')
        await accountCollection.deleteMany({})
    })

    describe('POST /signup', () => {
        test('Should return 200 on signup', async () => {
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

    describe('POST /login', () => {
        test('Should return 200 on signup', async () => {
            const password = await hash('123', 12)
            await accountCollection.insertOne({
                name: "Bernardo",
                email: "bernardorizzatti01@gmail.com",
                password
            })

            await request(app)
                .post('/api/login')
                .send({
                    name: "Bernardo",
                    email: "bernardorizzatti01@gmail.com",
                    password: "123",
                    passwordConfirmation: "123"
                })
                .expect(200)
        })
    })
})