import { Controller, EmailValidator, HttpRequest, HttpResponse } from 'presentation/protocols'
import { BadRequest } from '../helpers/http-helper'
import { MissingParamError, InvalidParamError, ServerError } from '../errors'

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) { }
  public handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return BadRequest(new MissingParamError(field))
        }

        const emailIsValid = this.emailValidator.isValid(httpRequest.body.email)

        if (!emailIsValid) {
          return BadRequest(new InvalidParamError('email'))
        }
      }

      return {} as HttpResponse
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError()
      }
    }
  }
}
