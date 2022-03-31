import {  MissingParamError } from "../../errors"
import { LoginController } from "./login-controller"
import {HttpRequest, Validation } from "./login-controller-protocols"
import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { badRequest, ok, serverError, unathorized } from '../../helpers/http/http-helper'

interface SutTypes {
    sut: LoginController,
    authenticationStub: Authentication,
    validationStub: Validation
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
    class ValidationStub implements Validation{
      validate(input: any): Error {
        return null
      }
    }
  
    return new ValidationStub()
  }
  
const makeSut = (): SutTypes => {
    const authenticationStub = makeAuthentication()
    const validationStub = makeValidation()
    const loginController = new LoginController(authenticationStub, validationStub)
    return { sut: loginController, authenticationStub, validationStub }
}

const makeHttpRequest = (): HttpRequest => {
    return {
        body: { email: 'any_email@email.com', password: 'any_password' }
    }
}

describe('', () => {


    test('should return 401 if invalid credentials are provided', async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)))

        const httpResponse = await sut.handle(makeHttpRequest())

        expect(httpResponse).toEqual(unathorized())
        expect(httpResponse.statusCode).toBe(401)

    })


    test('should return 500 if Authentication throws', async () => {
        const { sut, authenticationStub } = makeSut()
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

        const httpResponse = await sut.handle(makeHttpRequest())

        expect(httpResponse).toEqual(serverError(new Error()))
        expect(httpResponse.statusCode).toBe(500)
    })


    test('should return 200 if valid credentials are provided', async () => {
        const { sut } = makeSut()


        const httpResponse = await sut.handle(makeHttpRequest())

        expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
        expect(httpResponse.statusCode).toBe(200)
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
        const httpResponse = await sut.handle({ body : { email : 'valid_email@gmail.com' } })
        expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))

    })
})