import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'


const makeSut = (): CompareFieldsValidation => {
    return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('Require field validation', () => {
    test('Should return a InvalidParamError if validation fails', () => {
        const sut = makeSut()
        const error = sut.validate({ field: 'any_value', fieldToCompare: 'invalid_value'})
        expect(error).toEqual(new InvalidParamError('fieldToCompare'))
    })

    test('Should not rutrn if validation succeeds', () => {
        const sut = makeSut()
        const error = sut.validate({ field: 'valid_value', fieldToCompare: 'valid_value'})
        expect(error).toBeFalsy()
    })
})