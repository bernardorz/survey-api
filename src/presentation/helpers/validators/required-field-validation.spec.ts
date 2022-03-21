import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('Require field validation', () => {
    test('Should return a MissingPramError if validation fails', () => {
        const sut = new RequiredFieldValidation('field')
        const error = sut.validate({ name : 'any_name'})
        expect(error).toEqual(new MissingParamError('field'))
    })

    test('Should not rutrn if validation succeeds', () => {
        const sut = new RequiredFieldValidation('field')
        const error = sut.validate({ field : 'any_name'})
        expect(error).toBeFalsy()
    })
})