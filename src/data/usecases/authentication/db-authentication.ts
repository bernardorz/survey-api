import { LoadAccountByEmailRepository, Encrypter, UpdateAcessTokenRepository, HashCompare, AuthenticationModel, Authentication } from './db-authentication-protocols'
export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashCompare,
    private readonly encrypter: Encrypter,
    private readonly updateAcessTokenRepository: UpdateAcessTokenRepository
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email)
    if (account) {
      const passwordIsValid = await this.hashCompare.compare(authentication.password, account.password)

      if (!passwordIsValid) return null

      const acessToken = await this.encrypter.encrypt(account.id)
      await this.updateAcessTokenRepository.updateAcessToken(account.id, acessToken)
      return acessToken
    }
    return null
  }
}
