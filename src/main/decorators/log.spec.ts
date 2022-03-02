import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols"
import { LogControllerDecorator } from "./log"

interface sutTypes{
    sut: Controller,
    controllerStub: Controller
}

const makeController = () : Controller => {
    class ControllerStub implements Controller{
        public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
            const httpResponse = {
                body: httpRequest.body,
                statusCode: 200
            }
            return new Promise(resolve => resolve(httpResponse) )
        }
    }
    return new ControllerStub()
}

const makeSut = (): sutTypes => {

    const controllerStub = makeController()
    const sut = new LogControllerDecorator(controllerStub)

    return {
        sut,
        controllerStub
    }
}

describe('Log decorator', () => {
    test('Should call controller handle', async () => {
        const { sut, controllerStub } = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfiramtion: 'any_password'
            }
        }

        const handleSpy = jest.spyOn(controllerStub, 'handle')

        await sut.handle(httpRequest)
        expect(handleSpy).toHaveBeenCalledWith(httpRequest)
    })
})