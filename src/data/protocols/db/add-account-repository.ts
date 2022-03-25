import { AccountModel } from "domain/models/account" 
import { AddAcountModel } from "domain/usecases/add-account" 

export interface AddAccountRepository{
    add(accountData: AddAcountModel): Promise<AccountModel>
}