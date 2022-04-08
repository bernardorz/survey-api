import { Controller, HttpRequest, HttpResponse, AddAcount, Validation, Authentication, EmailInUseError } from './signup-controller-protocols'
import { badRequest, serverError, ok, forbidden } from '../../helpers/http/http-helper'


export class SignUpController implements Controller {
  constructor(
    private readonly addAcount: AddAcount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) { }
  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if(error){
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body
      
      const account = await this.addAcount.add({
        name,
        email,
        password
      })

      if(!account){
        return forbidden(new EmailInUseError())
      }
      
      const accessToken = await this.authentication.auth({
        email,
        password
      })

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
