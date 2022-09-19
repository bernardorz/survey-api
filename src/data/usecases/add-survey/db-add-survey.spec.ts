import { AddSurveyModel, AddSurveyRepository } from "./db-add-survey-protocols"
import {  DbAddySurvey} from "./db-add-survey"

const makeFakeSurveyData = () : AddSurveyModel => {
    return {
        question: "any_question",
        answers: [{
            image: 'any_image',
            answer: 'any_answer'
        }]
    }
}

interface SutTypes {
    sut: DbAddySurvey,
    addSurveyRepositoryStub: AddSurveyRepository
}


const makeSut = (): SutTypes => {
    class AddSurveyRepositoryStub implements AddSurveyRepository{
        add(data: AddSurveyModel): Promise<void> {
            return new Promise(resolve => resolve(null))
        }
    }

    const addSurveyRepositoryStub = new AddSurveyRepositoryStub()
    const sut = new DbAddySurvey(addSurveyRepositoryStub)

    return {
        sut,
        addSurveyRepositoryStub
    }
}

describe('DbAddSurvey Usecase', () => {
    test("Should call AddSurveyRepository with correct values", async () => {

        class AddSurveyRepositoryStub implements AddSurveyRepository{
            add(data: AddSurveyModel): Promise<void> {
                return new Promise(resolve => resolve(null))
            }
        }

        const { sut, addSurveyRepositoryStub} = makeSut()
        const surveyData = makeFakeSurveyData()
        
        const addSpy = jest.spyOn(addSurveyRepositoryStub, "add")
        await sut.add(surveyData)

        expect(addSpy).toHaveBeenCalledWith(surveyData)
    })
})