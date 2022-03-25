import { DbAddAcount } from './db-add-account'
import { AccountModel, AddAcountModel, Hasher, AddAccountRepository} from './db-add-account-protocols'

interface SutTypes{
    sut: DbAddAcount,
    hasherStub: Hasher 
    addAccountRepositoryStub: AddAccountRepository
}

const makeHasher = (): Hasher => {
    class HasherStub implements Hasher{
        async hash(value: string) : Promise<string>{
            return new Promise(resolve => resolve('hashed_password'))
        }
    }

    return new HasherStub()
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
 

    const hasherStub = makeHasher()
    const addAccountRepositoryStub = makeAddAcountRepository()
    const sut = new DbAddAcount(hasherStub, addAccountRepositoryStub)

    return { 
        sut,
        hasherStub,
        addAccountRepositoryStub
    }
}

describe('DbAddAcount Usecase', () => {
    test('Should call Hasher with correct password', () => {
            const { hasherStub, sut  } = makeSut()
            const hasher = jest.spyOn(hasherStub, 'hash')
            const accountData = {
                name: 'valid_name',
                email: 'valid_email@email.com',
                password: 'valid_password'
            }
            sut.add(accountData)
            expect(hasher).toHaveBeenCalledWith(accountData.password)
    })

    test('Should throw if Enctypter throw', async () => {
        const { hasherStub, sut  } = makeSut()
        jest.spyOn(hasherStub, 'hash').mockReturnValueOnce( new Promise((resolve, reject) => reject(new Error)))
     
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

    test('Should return an account on success', async () => {
        const { sut } = makeSut()
     
        const accountData = {
            name: 'valid_name',
            email: 'valid_email@email.com',
            password: 'valid_password'
        }

        const account = await sut.add(accountData)

        expect(account).toEqual({
            id: 'valid_id',
            name: 'valid_name',
            email: 'valid_email@email.com',
            password: 'hashed_password'
        })

    })

})