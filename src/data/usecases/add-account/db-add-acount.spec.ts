import { DbAddAcount } from './db-add-account'
import { AccountModel, AddAcountModel, Encrypter, AddAccountRepository} from './db-add-account-protocols'

interface SutTypes{
    sut: DbAddAcount,
    encrypterStub: Encrypter 
    addAccountRepositoryStub: AddAccountRepository
}

const makeEncrypter = (): Encrypter => {
    class EncrypterStub implements Encrypter{
        async encrypt(value: string) : Promise<string>{
            return new Promise(resolve => resolve('hashed_password'))
        }
    }

    return new EncrypterStub()
}

const makeAddAcountRepository = (): AddAccountRepository => {
    class AddAcountRepositoryStub implements AddAccountRepository{
        async  add(accountData: AddAcountModel): Promise<AccountModel>{

            const fakeAccount  = {
            id : 'valid_id',
            name: 'valid_name',
            email: 'valid_email@email.com',
            password: 'hashed_password'
            }
            return new Promise(resolve => resolve(fakeAccount))
        }
    }

    return new AddAcountRepositoryStub()
}

const makeSut = (): SutTypes => {
 

    const encrypterStub = makeEncrypter()
    const addAccountRepositoryStub = makeAddAcountRepository()
    const sut = new DbAddAcount(encrypterStub, addAccountRepositoryStub)

    return { 
        sut,
        encrypterStub,
        addAccountRepositoryStub
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

    test('Should throw if Enctypter throw', async () => {
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

    test('Should call AddAcountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub  } = makeSut()
        const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
     
        const accountData = {
            name: 'valid_name',
            email: 'valid_email@email.com',
            password: 'valid_password'
        }
        const promise = await sut.add(accountData)
         expect(addSpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_email@email.com',
            password: 'hashed_password'
        })
    })

    test('Should throw  if AddAcountRepository throw', async () => {
        const { sut, addAccountRepositoryStub  } = makeSut()
        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce( new Promise((resolve, reject) => reject(new Error)))
     
        const accountData = {
            name: 'valid_name',
            email: 'valid_email@email.com',
            password: 'valid_password'
        }
      
        const promise = sut.add(accountData)
        await expect(promise).rejects.toThrow()
    })
})