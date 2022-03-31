import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'


jest.mock('bcrypt', () => ({
    async hash() : Promise<string> {
        return new Promise(resolve => resolve('hash'))
    },

    async compare(): Promise<boolean>{
        return new Promise((resolve) => resolve(true))
    }
}))

const salt = 12
const makeSut = () : BcryptAdapter => {
    return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
    test('Should call hash with correct values', async () => {
      
        const sut = makeSut()
        const hashSpy = jest.spyOn(bcrypt, 'hash')
        await sut.hash('any_value')
        expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should return a valid hash on hash sucess', async () => {
        const sut = makeSut()

        const hash = await sut.hash('any_value')
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
        const promise = sut.hash('any_value')
                
        await expect(promise).rejects.toThrow()
    })

    test('Should call compare with correct values', async () => {
      
        const sut = makeSut()
        const compareSpy = jest.spyOn(bcrypt, 'compare')
        await sut.compare('any_value', 'any_hash')
        expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    test('Should return true when compare success', async () => {
      
        const sut = makeSut()
        const compare = await sut.compare('any_value', 'any_hash')
        expect(compare).toBe(true)
    })

    test('Should call compare with correct values', async () => {
      
        const sut = makeSut()
        jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => (
            new Promise((resolve) => resolve(false))
        ))
        const compare = await sut.compare('any_value', 'any_hash')
        expect(compare).toBe(false)
    })

    test('Should return throws if compare throws', async () => {
        const sut = makeSut()

        jest.spyOn(sut, 'compare').mockImplementationOnce(() => (
            new Promise((resolve, reject) => reject(new Error))
        ))
        const promise = sut.hash('any_value')
                
        await expect(promise).rejects.toThrow()
    })
    
})