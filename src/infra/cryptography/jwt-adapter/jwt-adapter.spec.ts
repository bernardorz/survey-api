import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter';


jest.mock('jsonwebtoken', () => ({
    async sign(): Promise<string>{
        return new Promise(resolve => resolve('any_token'))
    }
}))


const makeSut = (): JwtAdapter => {
    return new JwtAdapter('secret')
}


describe('Jwt Adapter', () => {
    test('should call sign with correct values', async () => {
        const sut = makeSut()
        const signSpy = jest.spyOn(jwt, 'sign')
        await sut.encrypt('any_id')

        expect(signSpy).toHaveBeenCalledWith({id: 'any_id'}, 'secret')
    })

    test('should return a token on sign sucess', async () => {
        const sut = makeSut()
        const acessToken = await sut.encrypt('any_id')

        expect(acessToken).toBe('any_token')
    })

    test('should return throw if sign throws', async () => {
        const sut = makeSut()
        jest.spyOn(jwt, 'sign').mockImplementationOnce(() => (
            new Promise((resolve,reject) => reject(new Error()))
        ))
        const promise = sut.encrypt('any_id')

        await expect(promise).rejects.toThrow()
    })
})