import { MissingParamError } from '../../errors'
import { RequiredFieldValidation } from './required-field-validation'


const makeSut = (): RequiredFieldValidation => {
    return new RequiredFieldValidation('field')
}

describe('Require field validation', () => {
    test('Should return a MissingPramError if validation fails', () => {
        const sut = makeSut()
        const error = sut.validate({ name : 'any_name'})
        expect(error).toEqual(new MissingParamError('field'))
    })

    test('Should not rutrn if validation succeeds', () => {
        const sut = makeSut()
        const error = sut.validate({ field : 'any_name'})
        expect(error).toBeFalsy()
    })
})