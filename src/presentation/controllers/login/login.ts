import { Controller, EmailValidator, HttpRequest, HttpResponse, AddAcount } from './login-protocols'
import { badRequest, serverError, ok } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
  ) { }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
   try {
    const requiredFields = ['email', 'password']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    const { email, password } = httpRequest.body

    const emailIsValid = this.emailValidator.isValid(email)

    if (!emailIsValid) {
      return badRequest(new InvalidParamError('email'))
    }
   } catch (error) {
    return serverError(error)
   }

  }
}