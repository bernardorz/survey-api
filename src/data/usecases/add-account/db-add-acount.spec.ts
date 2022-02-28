import { DbAddAcount } from './db-add-account'
import { Encrypter } from '../../protocols'

interface SutTypes{
    sut: DbAddAcount,
    encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
    class EncrypterStub implements Encrypter{
        async encrypt(value: string) : Promise<string>{
            return new Promise(resolve => resolve('hashed_password'))
        }
    }

    const encrypterStub = new EncrypterStub()
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
})