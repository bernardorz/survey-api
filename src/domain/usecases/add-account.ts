import { AccountModel } from '../models/account'

export interface AddAcountModel{
    name: string 
    email: string 
    password: string 
}

export interface AddAcount{
    add(account: AddAcountModel): Promise<AccountModel>
}