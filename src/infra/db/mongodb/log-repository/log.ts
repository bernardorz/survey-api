import { LogErrorRepository} from '../../../../data/protocols/db/log-error-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class LoggerMongoRepository implements LogErrorRepository{
    async logError(stackError: string): Promise<void> {
       const errorCollection = await MongoHelper.getCollection('errors')
       await errorCollection.insertOne({
           stack: stackError,
           date: new Date()
       })
    }
}