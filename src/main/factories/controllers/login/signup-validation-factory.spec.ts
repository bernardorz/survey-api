import { makeLoginValidation } from './login-validation-factory'
import { ValidationComposite} from '../../../../validation/validators/validation-composite'
import { RequiredFieldValidation } from '../../../../validation/validators/required-field-validation'
import { Validation } from '../../../../presentation/protocols/validation'
import { EmailValidation } from '../../../../validation/validators//email-validation'
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
  

describe('LoginValidation Factory', () => {
    test('Should call ValidaitonCompose with all validations', () => {
        makeLoginValidation()
        const validations: Validation[] =[]

        for(const field of ['email', 'password']){
            validations.push(new RequiredFieldValidation(field))
        }

        validations.push(new EmailValidation('email', makeEmailValidator() ))

        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})