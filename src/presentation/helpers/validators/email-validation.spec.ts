import { EmailValidation} from './email-validation'
import { EmailValidator} from '../../protocols/email-validator'
import { Validation } from '../../protocols/validation'

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator,
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

const makeSut = (): SutTypes => {
 
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}


describe('SignUp Controller', () => {

  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

     sut.validate({ email: 'any_email@gmail.com'})

    expect(isValidSpy).toHaveBeenCalledWith('any_email@gmail.com')
  })

  test('Should throws if EmailValidator throws', async () => {

    const { sut, emailValidatorStub } = makeSut()

     jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

     expect(sut.validate).toThrow()
  })
})
