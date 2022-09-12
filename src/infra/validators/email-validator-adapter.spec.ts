import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => {
    return {
        isEmail (): boolean{
            return true
        }
    }
})


const makeSut = (): EmailValidatorAdapter =>{
    return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
    test("Should reutrn false if validator returns false", () => {
        const sut = makeSut()
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
        const isValid = sut.isValid('invalid_email')
        expect(isValid).toBe(false)
    })

    test("Should reutrn true if validator returns true", () => {
        const sut = makeSut()
        const isValid = sut.isValid('valid_email@email.com')
        expect(isValid).toBe(true)
    })

    test("Should call call validor with correct email", () => {
        const sut = makeSut()
        const isEmail = jest.spyOn(validator, 'isEmail')
        sut.isValid('any_email@email.com')
        expect(isEmail).toHaveBeenCalledWith('any_email@email.com')
    })
})