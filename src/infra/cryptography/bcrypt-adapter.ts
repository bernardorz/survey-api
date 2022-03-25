import { Hasher } from '../../data/protocols'
import { hash } from 'bcrypt'

export class BcryptAdapter implements Hasher{
    constructor(
        private readonly salt: number
    ){}
    public async hash(value: string): Promise<string> {
        const hashedValue = await hash(value, this.salt)
        return hashedValue
    }
}