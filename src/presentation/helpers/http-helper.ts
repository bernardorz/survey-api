import { HttpResponse } from '../protocols'

export const BadRequest = (error: Error): HttpResponse => (
    {
        statusCode: 400,
        body :error
    }
)
