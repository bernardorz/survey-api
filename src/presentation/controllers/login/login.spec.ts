import { MissingParamError } from "../../../presentation/errors"
import { LoginController } from "./login"


interface SutTypes{
    sut: LoginController
}
const makeSut = () : SutTypes => {
    const loginController = new LoginController()
    return { sut: loginController}
}

describe('', () => {
    test('should reutrn 400 if email is not provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
          body: { password: 'any_password' }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('should reutrn 400 if password is not provided', async () => {
        const { sut } = makeSut()
        const httpRequest = {
          body: { email: 'any_email@email.com' }
        }
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })
})