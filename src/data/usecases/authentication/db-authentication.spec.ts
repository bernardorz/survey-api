import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository"
import { AuthenticationModel } from "../../../domain/usecases/authentication"
import { DbAuthentication } from './db-authentication'
import { AccountModel } from "../add-account/db-add-account-protocols"
import { HashCompare } from "../../../data/protocols/cryptography/hash-compare-"
import { rejects } from "assert"



const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
        async load(email: string): Promise<AccountModel> {
            const account: AccountModel = {
                email: 'any_email@email.com',
                id: 'any_id',
                name: 'any_name',
                password: 'any_password'
            }
            return new Promise(resolve => resolve(account))
        }
    }

    return new LoadAccountByEmailRepositoryStub()
}

const makeFakeAuthentication = (): AuthenticationModel => {
    return {
        email: 'any_email@email.com',
        password: 'any_password'
    }
}

const makeFakeAccount = (): AccountModel => {
    return {
        email: 'any_email@email.com',
        password: 'hashed_password',
        id: 'any_id',
        name: 'any_name'
    }
}
interface SutTypes {
    sut: DbAuthentication,
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository,
    hashedCompareStub: HashCompare
}

const makeHashCompareStub = (): HashCompare => {
    class HashedCompareStub implements HashCompare {
        async compare(value: string, hash: string): Promise<boolean> {
            return new Promise(resolve => resolve(true))
        }
    }

    return new HashedCompareStub()
}


const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
    const hashedCompareStub = makeHashCompareStub()

    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashedCompareStub)
    return {
        sut,
        loadAccountByEmailRepositoryStub,
        hashedCompareStub
    }
}

describe('DbAuthentication UseCase', () => {
    test('should call LoadAccountByEmailRepository with correct email', async () => {

        const { loadAccountByEmailRepositoryStub, sut } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')

        await sut.auth(makeFakeAuthentication())

        expect(loadSpy).toHaveBeenCalledWith('any_email@email.com')
    })

    test('should throw if LoadAccountByEmailRepository throws', async () => {

        const { loadAccountByEmailRepositoryStub, sut } = makeSut()
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
            .mockReturnValueOnce(new Promise((_, reject) => reject(new Error())))

        const promise = sut.auth(makeFakeAuthentication())

        await expect(promise).rejects.toThrow()
    })

    test('should return null if LoadAccountByEmailRepository returns null', async () => {

        const { loadAccountByEmailRepositoryStub, sut } = makeSut()

        jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)

        const acessToken = await sut.auth(makeFakeAuthentication())

        expect(acessToken).toBeNull()
    })

    test('should call HashComparer with correct values', async () => {

        const { sut, hashedCompareStub, loadAccountByEmailRepositoryStub } = makeSut()
        jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
            .mockReturnValueOnce(new Promise(resolve => resolve(makeFakeAccount())))

        const compare = jest.spyOn(hashedCompareStub, 'compare')

        await sut.auth(makeFakeAuthentication())

        expect(compare).toHaveBeenCalledWith('any_password', 'hashed_password')
    })

    test('should throw if HashComparer throws', async () => {

        const { sut, hashedCompareStub } = makeSut()
        jest.spyOn(hashedCompareStub, 'compare')
            .mockReturnValueOnce(new Promise((_, reject) => reject(new Error())))

        const promise = sut.auth(makeFakeAuthentication())

        await expect(promise).rejects.toThrow()
    })
})