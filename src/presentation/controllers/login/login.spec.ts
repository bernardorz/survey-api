import { InvalidParamError, MissingParamError, ServerError } from "../../../presentation/errors"
import { LoginController } from "./login"
import { EmailValidator } from "./login-protocols"
interface SutTypes{
    sut: LoginController,
    emailValidatorStub: EmailValidator
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
    const loginController = new LoginController(emailValidatorStub)
    return { sut: loginController, emailValidatorStub}
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
        const httpRequest = {
          body: { email: 'any_email@email.com', password: 'any_password' }
        }

         await sut.handle(httpRequest)

         expect(validateEmail).toHaveBeenCalledWith('any_email@email.com')
     
    })

    test('should return 500 if EmailValidator throws', async () => {
        const { sut, emailValidatorStub } = makeSut()
        const validateEmail = jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
            throw new Error()
        })
        const httpRequest = {
          body: { email: 'any_email@email.com', password: 'any_password' }
        }

        const httpResponse = await sut.handle(httpRequest)

        expect(validateEmail).toHaveBeenCalled()
        expect(httpResponse.statusCode).toBe(500)
        expect(httpResponse.body).toEqual(new ServerError(null))
     
    })

    test('should return 400 if EmailValidator return false', async () => {
        const { sut, emailValidatorStub } = makeSut()
        const validateEmail = jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => false)
        const httpRequest = {
          body: { email: 'any_email@email.com', password: 'any_password' }
        }

        const httpResponse = await sut.handle(httpRequest)

        expect(validateEmail).toHaveBeenCalled()
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
     
    })
    
})