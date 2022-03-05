import { Controller, HttpRequest, HttpResponse } from "@/presentation/protocols"
import { LogControllerDecorator } from "./log"
import { serverError } from '../../presentation/helpers/http-helper'
import { LogErrorRepository } from "../../data/protocols/log-error-repository"

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

const makeLogErrorRepository = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository{
        async logError(stackError: string) : Promise<void>{
            return new Promise(resolve => resolve())
        }
    }

    return new LogErrorRepositoryStub()
}

interface sutTypes{
    sut: Controller,
    controllerStub: Controller,
    logErrorRepositoryStub : LogErrorRepository
}
const makeSut = (): sutTypes => {

    const controllerStub = makeController()
    const logErrorRepositoryStub = makeLogErrorRepository()
    const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

    return {
        sut,
        controllerStub,
        logErrorRepositoryStub
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

    test('Should return the same result of the controller', async () => {
        const { sut } = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email@email.com',
                password: 'any_password',
                passwordConfiramtion: 'any_password'
            }
        }
   
        const httpResponse = await sut.handle(httpRequest)
        expect(httpRequest.body).toEqual(httpResponse.body)
    })

    test('Shoul call LogErrorRepository with correct error if controller returns a server error', async () => {
        const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
        const fakeError = new Error()
        fakeError.stack = 'any_stack'
        const error = serverError(fakeError)
        
        const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError')
        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)))
        const httpRequest = {
            body: {
              name: 'any_name',
              email: 'invalid_email@email.com',
              password: 'any_password',
              passwordConfirmation: 'any_password'
            }
          }
         await sut.handle(httpRequest)
        expect(logSpy).toHaveBeenCalledWith('any_stack')
    })
})