import { LoadAccountByEmailRepository } from "../../protocols/load-account-by-email-repository"
import { AuthenticationModel  } from "../../../domain/usecases/authentication"
import { DbAuthentication } from './db-authentication'
import { AccountModel } from "../add-account/db-add-account-protocols"



const makeLoadAccountByEmailRepositoryStub =() : LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository{
        async load (email: string): Promise<AccountModel>{
            const account: AccountModel = {
                email: 'any_email@email.com',
                id: 'any_id',
                name: 'any_name',
                password: 'any_password'
            }
            return new Promise(resolve => resolve(account))
        }
    }

    return new  LoadAccountByEmailRepositoryStub()
}

const makeFakeAuthentication = ():AuthenticationModel  => {
    return {
        email : 'any_email@email.com',
        password: 'any_password'
    }
}
interface SutTypes{
    sut: DbAuthentication,
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}
const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()

    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
    return {
        sut,
        loadAccountByEmailRepositoryStub
    }
}

describe('DbAuthentication UseCase', () => {
    test('should call LoadAccountByEmailRepository with correct email', async () => {

        const { loadAccountByEmailRepositoryStub, sut} = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
        
        await sut.auth(makeFakeAuthentication())

        expect(loadSpy).toHaveBeenCalledWith('any_email@email.com')
    })
})