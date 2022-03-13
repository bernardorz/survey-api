import { makeSignUpValidation } from './signup-validation'
import { ValidationComposite} from '../../presentation/helpers/validators/validation-composite'
import { RequiredFieldValidation } from '../../presentation/helpers/validators/require-field-validation'
import { Validation } from '@/presentation/helpers/validators/validation'


jest.mock('../../presentation/helpers/validators/validation-composite')

describe('SignUpValidation Factory', () => {
    test('Should call ValidaitonCompose with all validations', () => {
        makeSignUpValidation()
        const validations: Validation[] =[]

        for(const field of ['name', 'email', 'password', 'passwordConfirmation']){
            validations.push(new RequiredFieldValidation(field))
        }
        expect(ValidationComposite).toHaveBeenCalledWith(validations)
    })
})