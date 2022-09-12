import { makeSignUpValidation } from './signup-validation-factory'
import { ValidationComposite} from '../../../../validation/validators'
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { Validation } from '../../../../presentation/protocols'
import { CompareFieldsValidation } from '../../../../validation/validators'
import { EmailValidation } from '../../../../validation/validators'
import { EmailValidator } from '../../../../validation/protocols/email-validator'





jest.mock('../../../../validation/validators/validation-composite')


const makeEmailValidator = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
      isValid(email: string): boolean {
        return true
      }
    }
    const emailValidatorStub = new EmailValidatorStub()
    return emailValidatorStub
  }
  

describe('SignUpValidation Factory', () => {
    test('Should call ValidaitonCompose with all validations', () => {
        makeSignUpValidation()
        const validations: Validation[] =[]

        for(const field of ['name', 'email', 'password', 'passwordConfirmation']){
            validations.push(new RequiredFieldValidation(field))
        }

        validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))

        validations.push(new EmailValidation('email', makeEmailValidator() ))

        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})