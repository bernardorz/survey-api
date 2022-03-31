import { Controller, HttpRequest, HttpResponse, Validation } from './login-controller-protocols'
import { badRequest, serverError, ok, unathorized } from '../../helpers/http/http-helper'
import { Authentication } from '../../../domain/usecases/authentication'

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) { }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
   try {
    const error = this.validation.validate(httpRequest.body)

    if(error){
      return badRequest(error)
    }

    const { email, password } = httpRequest.body

    const accessToken = await this.authentication.auth({ email, password })

    if(!accessToken){
      return unathorized()
    }

    return ok({accessToken})

   } catch (error) {
    return serverError(error)
   }

  }
}