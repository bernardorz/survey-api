import { HashCompare } from '../../../data/protocols/cryptography/hash-compare-' 
import { LoadAccountByEmailRepository } from '../../../data/protocols/db/load-account-by-email-repository' 
import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'


export class DbAuthentication implements Authentication{
    constructor(
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
        private readonly hashCompare: HashCompare
    ){}
    async auth(authentication: AuthenticationModel): Promise<string> {
        const account = await this.loadAccountByEmailRepository.load(authentication.email)
        if(account){
            await this.hashCompare.compare(authentication.password, account.password)
        }
        return null
    }
}
