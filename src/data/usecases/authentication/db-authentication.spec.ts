import { LoadAccountByEmailRepository, Encrypter , UpdateAcessTokenRepository, HashCompare, AuthenticationModel } from './db-authentication-protocols'
import { DbAuthentication } from './db-authentication'
import { AccountModel } from '../add-account/db-add-account-protocols'

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
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
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashedCompareStub: HashCompare
  encrypterStub: Encrypter
  updateAcessTokenRepositoryStub: UpdateAcessTokenRepository
}

const makeHashCompareStub = (): HashCompare => {
  class HashedCompareStub implements HashCompare {
    async compare (value: string, hash: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }

  return new HashedCompareStub()
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }

  return new EncrypterStub()
}

const makeUpdateAcessTokenRepositoryStub = (): UpdateAcessTokenRepository => {
  class UpdateAcessTokenRepositoryStub implements UpdateAcessTokenRepository {
    async update (userId: string, token: string): Promise<void> {

    }
  }

  return new UpdateAcessTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub()
  const hashedCompareStub = makeHashCompareStub()
  const encrypterStub = makeEncrypterStub()
  const updateAcessTokenRepositoryStub = makeUpdateAcessTokenRepositoryStub()

  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashedCompareStub, encrypterStub, updateAcessTokenRepositoryStub)
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashedCompareStub,
    encrypterStub,
    updateAcessTokenRepositoryStub
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
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

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
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  })

  test('Should return null if HashComparer returns false', async () => {
    const { sut, hashedCompareStub } = makeSut()
    jest.spyOn(hashedCompareStub, 'compare')
      .mockReturnValueOnce(new Promise((resolve) => resolve(false)))

    const promise = await sut.auth(makeFakeAuthentication())

    expect(promise).toBeNull()
  })

  test('should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const generateSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.auth(makeFakeAuthentication())
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  })

  test('should  return acess token if Encrypter success', async () => {
    const { sut } = makeSut()

    const acessToken = await sut.auth(makeFakeAuthentication())

    expect(acessToken).toBe('any_token')
  })

  test('Should call UpdateAcessTokenRepository with correct values', async () => {
    const { sut, updateAcessTokenRepositoryStub } = makeSut()

    const updateSpy = jest.spyOn(updateAcessTokenRepositoryStub, 'update')

    await sut.auth(makeFakeAuthentication())

    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('Should throws if UpdateAcessTokenRepository throws', async () => {
    const { sut, updateAcessTokenRepositoryStub } = makeSut()

    jest.spyOn(updateAcessTokenRepositoryStub, 'update')
      .mockReturnValueOnce(new Promise((resolve,reject) => reject(new Error())))

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  })
})
