import { MissingParamError } from '../../../presentation/errors/missing-param-error'
import { badRequest } from '../../../presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '../../protocols/index'

export class LoginController implements Controller{
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        const requiredFields = ['email', 'password']

        for (const field of requiredFields) {
          if (!httpRequest.body[field]) {
            return badRequest(new MissingParamError(field))
          }
        }
  
    }
}