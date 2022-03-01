import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'


jest.mock('bcrypt', () => ({
    async hash() : Promise<string> {
        return new Promise(resolve => resolve('hash'))
    }
}))

const salt = 12
const makeSut = () : BcryptAdapter => {
    return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
    test('Should call bcrypt with correct values', async () => {
      
        const sut = makeSut()
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.encrypt('any_value')
        expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should return a hash on sucess', async () => {
        const sut = makeSut()

        const hash = await sut.encrypt('any_value')
        expect(hash).toBeTruthy()
        expect(hash).toBe('hash')
    })

    test('Should return throws if bcrypt throws', async () => {
        const sut = makeSut()

        jest.spyOn(bcrypt, 'hash').mockImplementation(
            () => (
                new Promise((resolve, reject) => reject(new Error))
            )
        )
        const promise = sut.encrypt('any_value')
                
        await expect(promise).rejects.toThrow()
    })
})