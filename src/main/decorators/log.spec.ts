import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols"
import { LogControllerDecorator } from "./log"


describe('Log decorator', () => {
    test('Should call controller handle', async () => {

        class ControllerStub implements Controller{
            public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
                const httpResponse = {
                    body: httpRequest.body,
                    statusCode: 200
                }
                return new Promise(resolve => resolve(httpResponse) )
            }
        }
        const controllerStub = new ControllerStub()
        const handleSpy = jest.spyOn(controllerStub, 'handle')
        const sut = new LogControllerDecorator(controllerStub)
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfiramtion: 'any_password'
            }
        }
        sut.handle(httpRequest)

        await sut.handle(httpRequest)
        expect(handleSpy).toHaveBeenCalledWith(httpRequest)
    })
})