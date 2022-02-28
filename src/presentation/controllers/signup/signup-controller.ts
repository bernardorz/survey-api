import { Controller, EmailValidator, HttpRequest, HttpResponse, AddAcount } from './signup-protocols'
import { badRequest, serverError } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'


export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAcount: AddAcount
  ) { }
  public handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const emailIsValid = this.emailValidator.isValid(email)

      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const createAccount = this.addAcount.add({
        name,
        email,
        password
      })

      return {
        statusCode: 201,
        body: createAccount
      }
    } catch (error) {
      return serverError()
    }
  }
}