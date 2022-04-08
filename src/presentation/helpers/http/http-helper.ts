import { HttpResponse } from '../../protocols'
import { ServerError,UnauthorizedError } from '../../errors'

export const badRequest = (error: Error): HttpResponse => (
    {
        statusCode: 400,
        body :error
    }
)

export const forbidden = (error: Error): HttpResponse => (
    {
        statusCode: 403,
        body :error
    }
)


export const serverError = (error: Error): HttpResponse => {
    return {
        statusCode: 500,
        body: new ServerError(error.stack)
    }
}

export const ok = (data: any): HttpResponse => {
    return {
        statusCode : 200,
        body: data
    }
}
export const unathorized = (): HttpResponse => (
    {
        statusCode: 401,
        body : new UnauthorizedError()
    }
)