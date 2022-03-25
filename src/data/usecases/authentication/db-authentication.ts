import { TokenGenerator } from '../../../data/protocols/cryptography/token-generator'
import { HashCompare } from '../../../data/protocols/cryptography/hash-compare-'
import { LoadAccountByEmailRepository } from '../../../data/protocols/db/load-account-by-email-repository'
import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { UpdateAcessTokenRepository } from '../../../data/protocols/db/update-acess-token-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashCompare,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAcessTokenRepository: UpdateAcessTokenRepository
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      const passwordIsValid = await this.hashCompare.compare(authentication.password, account.password)

      if (!passwordIsValid) return null

      const acessToken = await this.tokenGenerator.generate(account.id)
      await this.updateAcessTokenRepository.update(account.id, acessToken)
      return acessToken
    }
    return null
  }
}
