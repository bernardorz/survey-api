import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter';


jest.mock('jsonwebtoken', () => ({
    async sign(): Promise<string>{
        return new Promise(resolve => resolve('any_token'))
    }
}))


describe('Jwt Adapter', () => {
    test('should call sign with correct values', async () => {
        const sut = new JwtAdapter('secret');
        const signSpy = jest.spyOn(jwt, 'sign')
        await sut.encrypt('any_id')

        expect(signSpy).toHaveBeenCalledWith({id: 'any_id'}, 'secret')
    })

    test('should return a token on sign sucess', async () => {
        const sut = new JwtAdapter('secret');
        const acessToken = await sut.encrypt('any_id')

        expect(acessToken).toBe('any_token')
    })
})