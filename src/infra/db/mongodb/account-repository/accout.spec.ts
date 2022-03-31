import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

let accountCollection: Collection;

describe('Account mongo repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  test('Should return an account on add success', async () => {
    const sut = makeSut()

    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })

    expect(account).toBeTruthy()
    expect(account).toHaveProperty('id')
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@email.com')
    expect(account).toHaveProperty('id')
  })

  test('Should return an account on loadByEmail success', async () => {
    await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password'
    })

    const sut = makeSut()
    const loadAccountByEmail = await sut.loadByEmail('any_email@email.com')

    expect(loadAccountByEmail).toBeTruthy()
    expect(loadAccountByEmail).toHaveProperty('id')
    expect(loadAccountByEmail.name).toBe('any_name')
    expect(loadAccountByEmail.email).toBe('any_email@email.com')
  })
})
