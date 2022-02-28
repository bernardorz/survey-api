import { EmailValidatorAdapter } from './email-validator'

describe('EmailValidator Adapter', () => {
    test("Should reutrn flase if validator returns false", () => {
        const sut = new EmailValidatorAdapter()
        const isValid = sut.isValid('invalid_email@email.com  ')
        expect(isValid).toBe(false)
    })
})