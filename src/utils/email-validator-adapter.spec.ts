import { EmailValidatorAdapter } from './email-validator'
import validator from 'validator'

jest.mock('validator', () => {
    return {
        isEmail (): boolean{
            return true
        }
    }
})

describe('EmailValidator Adapter', () => {
    test("Should reutrn false if validator returns false", () => {
        const sut = new EmailValidatorAdapter()
        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
        const isValid = sut.isValid('invalid_email')
        expect(isValid).toBe(false)
    })

    test("Should reutrn true if validator returns true", () => {
        const sut = new EmailValidatorAdapter()
        const isValid = sut.isValid('valid_email@email.com')
        expect(isValid).toBe(true)
    })

    test("Should call call validor with correct email", () => {
        const sut = new EmailValidatorAdapter()
        const isEmail = jest.spyOn(validator, 'isEmail')
        sut.isValid('any_email@email.com')
        expect(isEmail).toHaveBeenCalledWith('any_email@email.com')
    })
})