import { Encrypter } from '../../data/protocols'
import { hash } from 'bcrypt'

export class BcryptAdapter implements Encrypter{
    constructor(
        private readonly salt: number
    ){}
    public async encrypt(value: string): Promise<string> {
        const hashedValue = await hash(value, this.salt)
        return hashedValue
    }
}