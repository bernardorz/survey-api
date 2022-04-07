import { SignUpController } from './signup-controller'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { AccountModel, AddAcount, AddAcountModel, HttpRequest, Validation } from './signup-controller-protocols'
import { badRequest } from '../../helpers/http/http-helper'
import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
interface SutTypes {
  sut: SignUpController
  addAcountStub: AddAcount
  validationStub: Validation
  authenticationStub: Authentication
}

const makeHttpRequest = (): HttpRequest => {
  return {
    body: {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password',
      passwordConfirmation: 'invalid_password'
    }
  }
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(authentication: AuthenticationModel): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }

  return new AuthenticationStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}

const makeAddAcount = (): AddAcount => {
  class AddAcountStub implements AddAcount {
    async add(account: AddAcountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password'
      }
      return new Promise(resolve => resolve(fakeAccount))
    }
  }

  return new AddAcountStub()
}

const makeSut = (): SutTypes => {

  const addAcountStub = makeAddAcount()
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()
  const sut = new SignUpController(addAcountStub, validationStub, authenticationStub)
  return {
    sut,
    addAcountStub,
    validationStub,
    authenticationStub
  }
}

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
      passwordConfirmation: 'valid_password'
    }
  }
}

describe('SignUp Controller', () => {

  test('Should call AddAccount with correct values', async () => {

    const { sut, addAcountStub } = makeSut()
    const addAcount = jest.spyOn(addAcountStub, 'add')
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }
    await sut.handle(httpRequest)

    expect(addAcount).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    })
  })

  test('Should reutrn 500 if AddAcount throws', async () => {
    const { sut, addAcountStub } = makeSut()
    const addAcount = jest.spyOn(addAcountStub, 'add').mockImplementation(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(addAcount).toHaveBeenCalled()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(null))
  })

  test('Should return 201 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
    })
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeHttpRequest()
    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))

  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle({ body: { email: 'any_email@email.com', password: 'any_password' } })
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@email.com', password: 'any_password'
    })
  })

  test('Should reutrn 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth').mockImplementation(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(authSpy).toHaveBeenCalled()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError(null))
  })



})
