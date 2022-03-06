import { Controller, EmailValidator, HttpRequest, HttpResponse, AddAcount } from './login-protocols'
import { badRequest, serverError, ok, unathorized } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'
import { Authentication } from '../../../domain/usecases/authentication'

export class LoginController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
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

    const accessToken = await this.authentication.auth(email, password)

    if(!accessToken){
      return unathorized()
    }

    return ok({accessToken})

   } catch (error) {
    return serverError(error)
   }

  }
}