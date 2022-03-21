import { makeSignUpValidation } from './signup-validation'
import { ValidationComposite} from '../../../../presentation/helpers/validators/validation-composite'
import { RequiredFieldValidation } from '../../../../presentation/helpers/validators/required-field-validation'
import { Validation } from '../../../../presentation/helpers/validators/validation'
import { CompareFieldsValidation } from '../../../../presentation/helpers/validators/compare-fields-validation'
import { EmailValidation } from '../../../../presentation/helpers/validators/email-validation'
import { EmailValidator } from '../../../../presentation/protocols/email-validator'





jest.mock('../../../../presentation/helpers/validators/validation-composite')


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