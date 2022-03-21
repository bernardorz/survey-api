import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { InvalidParamError } from '../../../presentation/errors'
import { Validation } from '../../protocols/validation'

export class EmailValidation implements Validation{
    constructor(private readonly fieldName: string,  private readonly emailValidator: EmailValidator){}
    validate(input: any): Error {
        const emailIsValid = this.emailValidator.isValid(input[this.fieldName])

        if (!emailIsValid) {
          return new InvalidParamError(this.fieldName)
        }
    }
}

