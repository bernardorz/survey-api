import { Controller, HttpRequest, HttpResponse, AddAcount, Validation } from './signup-controller-protocols'
import { badRequest, serverError, ok } from '../../helpers/http/http-helper'


export class SignUpController implements Controller {
  constructor(
    private readonly addAcount: AddAcount,
    private readonly validation: Validation
  ) { }
  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if(error){
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body
      
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
