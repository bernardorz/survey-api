import { InvalidParamError, MissingParamError, ServerError } from "../../../presentation/errors"
import { LoginController } from "./login"
import { EmailValidator, HttpRequest } from "./login-protocols"
import {  Authentication } from '../../../domain/usecases/authentication'
interface SutTypes{
    sut: LoginController,
    emailValidatorStub: EmailValidator,
    authenticationStub: Authentication
}

const makeAuthentication = (): Authentication => {
    class AuthenticationStub implements Authentication{
        async auth(email: string, password: string): Promise<string>{
            return new Promise(resolve => resolve('any_token'))
        }
    }

    return new AuthenticationStub()
}

const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
      isValid(email: string): boolean {
        return true
      }
    }
    const emailValidatorStub = new EmailValidatorStub()
    return emailValidatorStub
}

const makeSut = () : SutTypes => {
    const emailValidatorStub = makeEmailValidator()
    const authenticationStub = makeAuthentication()
    const loginController = new LoginController(emailValidatorStub, authenticationStub)
    return { sut: loginController, emailValidatorStub, authenticationStub}
}

const makeHttpRequest = () : HttpRequest => {
    return { 
        body : {  email: 'any_email@email.com', password: 'any_password'}
    }
}

describe('', () => {
    test('should reutrn 400 if email is not provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
          body: { password: 'any_password' }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('should reutrn 400 if password is not provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
          body: { email: 'any_email@email.com' }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })

    test('should call EmailValidator with correct value', async () => {
        const { sut, emailValidatorStub } = makeSut()
        const validateEmail = jest.spyOn(emailValidatorStub, 'isValid')
         await sut.handle(makeHttpRequest())

         expect(validateEmail).toHaveBeenCalledWith('any_email@email.com')
     
    })

    test('should return 500 if EmailValidator throws', async () => {
        const { sut, emailValidatorStub } = makeSut()
        const validateEmail = jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
            throw new Error()
        })

        const httpResponse = await sut.handle(makeHttpRequest())

        expect(validateEmail).toHaveBeenCalled()
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError(null))
     
    })

    test('should return 400 if EmailValidator return false', async () => {
        const { sut, emailValidatorStub } = makeSut()
        const validateEmail = jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

        const httpResponse = await sut.handle(makeHttpRequest())

        expect(validateEmail).toHaveBeenCalled()
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
     
    })

    test('should call Authentication with correct values', async () => {
        const { sut, authenticationStub } = makeSut()
        const authSpy = jest.spyOn(authenticationStub, 'auth')

        await sut.handle(makeHttpRequest())

        expect(authSpy).toHaveBeenCalledWith('any_email@email.com','any_password')
    })
    
})