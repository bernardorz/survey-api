import { AddSurvey, AddSurveyModel } from "../../../domain/usecases/add-survey";
import { AddSurveyRepository } from "./db-add-survey-protocols";

export class DbAddySurvey implements AddSurvey{

    constructor(
        private readonly addSurveyRepository: AddSurveyRepository
    ){}
   async add(data: AddSurveyModel): Promise<void> {
        await this.addSurveyRepository.add(data)
    }
}