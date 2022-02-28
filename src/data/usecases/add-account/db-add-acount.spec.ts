import { DbAddAcount } from './db-add-account'
import { Encrypter } from './db-add-account-protocols'

interface SutTypes{
    sut: DbAddAcount,
    encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter{
        async encrypt(value: string) : Promise<string>{
            return new Promise(resolve => resolve('hashed_password'))
        }
    }

    return new EncrypterStub()
}

const makeSut = (): SutTypes => {
 

    const encrypterStub = makeEncrypter()
    const sut = new DbAddAcount(encrypterStub)

    return { 
        sut,
        encrypterStub
    }
}

describe('DbAddAcount Usecase', () => {
    test('Should call Encrtyper with correct password', () => {
            const { encrypterStub, sut  } = makeSut()
            const encrypter = jest.spyOn(encrypterStub, 'encrypt')
            const accountData = {
                name: 'valid_name',
                email: 'valid_email@email.com',
                password: 'valid_password'
            }
            sut.add(accountData)
            expect(encrypter).toHaveBeenCalledWith(accountData.password)
    })

    test('Should throw if Enctypter thors', async() => {
        const { encrypterStub, sut  } = makeSut()
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce( new Promise((resolve, reject) => reject(new Error)))
     
        const accountData = {
            name: 'valid_name',
            email: 'valid_email@email.com',
            password: 'valid_password'
        }
        const promise = sut.add(accountData)
        await expect(promise).rejects.toThrow()
})
})