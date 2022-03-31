import { Hasher } from '../../../data/protocols/cryptography/hasher'
import { HashCompare } from '../../../data/protocols/cryptography/hash-compare'
import { hash, compare } from 'bcrypt'

export class BcryptAdapter implements Hasher, HashCompare{
    constructor(
        private readonly salt: number
    ){}
    public async hash(value: string): Promise<string> {
        const hashedValue = await hash(value, this.salt)
        return hashedValue
    }

    public async compare(value: string, hash: string): Promise<boolean> {
        const isEqual = await compare(value, hash)
        return isEqual
    }
}