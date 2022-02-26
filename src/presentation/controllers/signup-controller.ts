import { Controller, HttpRequest, HttpResponse } from 'presentation/protocols'
import { BadRequest } from '../helpers/http-helper'
import { MissingParamError } from '../errors/MissingParamError'
export class SignUpController implements Controller {
  public handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return BadRequest(new MissingParamError(field))
      }

    }

    return {} as HttpResponse
  }
}
