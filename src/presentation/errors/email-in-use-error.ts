export class EmailInUseError extends Error{
    constructor(){
        super(`The Received email is already in use`)
        this.name = 'EmailInUseError'
        
    }
}