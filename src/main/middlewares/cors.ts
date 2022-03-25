import { Response, Request, NextFunction } from "express" 

export const cors = (request: Request, response:Response, next: NextFunction) : void => {
    response.set('acess-control-allow-origin', '*')
    response.set('acess-control-allow-methods', '*')
    response.set('acess-control-allow-headers', '*')
    next()
}