import { MissingParamError } from '../../errors'
import { Validation } from '../../protocols/validation'
import { ValidationComposite } from './validation-composite'


interface SutTypes {
    sut: ValidationComposite,
    validationStubs: Validation[]
}

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
        validate(input: any): Error {
            return null
        }
    }

    const validationStub = new ValidationStub() 
    return validationStub
}

const makeSut = (): SutTypes => {
    const validationStubs = [makeValidation(), makeValidation()]
    const sut = new ValidationComposite(validationStubs)

    return {
        sut,
        validationStubs
    }
}

describe('Validation Composite', () => {
    test('Should return an error if any validation fails', () => {
        const { sut, validationStubs} = makeSut()

        jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new MissingParamError('field'))
        const error = sut.validate({ field: 'any_value' })
        expect(error).toEqual(new MissingParamError('field'))
    })

    test('Should return the firts error if more then one validation fails ', () => {
        const { sut, validationStubs} = makeSut()

        jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
        jest.spyOn(validationStubs[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))

        const error = sut.validate({ field: 'any_value' })
        expect(error).toEqual(new Error())
    })

    test('Should not return if validation successed ', () => {
        const { sut} = makeSut()

        const error = sut.validate({ field: 'any_value' })
        expect(error).toBeFalsy()
    })

})