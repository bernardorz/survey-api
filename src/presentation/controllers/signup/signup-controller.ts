import { Controller, EmailValidator, HttpRequest, HttpResponse, AddAcount, Validation } from './signup-protocols'
import { badRequest, serverError, ok } from '../../helpers/http-helper'
import {  InvalidParamError } from '../../errors'


export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAcount: AddAcount,
    private readonly validation: Validation
  ) { }
  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if(error){
        return badRequest(error)
      }


      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const emailIsValid = this.emailValidator.isValid(email)

      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const createAccount = await this.addAcount.add({
        name,
        email,
        password
      })

      return ok(createAccount)
    } catch (error) {
      return serverError(error)
    }
  }
}
