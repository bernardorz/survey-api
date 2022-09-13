import { HttpRequest } from './add-survey-controller-protocols' 
import { AddSurveyController } from './add-survey-controller' 
import { Validation } from '../../../protocols'

interface SutTypes {
    sut: AddSurveyController
    validationStub:  Validation
}

const makeFakeRequest = (): HttpRequest => (
    {
        body : {
            question:   "any question",
            answers: [{
                image : "any_image",
                answer: "äny_answer"
            }]
        }
    }
)

const makeValidation = (): Validation => {

    class ValidationStub implements Validation {
        validate(input: any): Error {
            return null
        }
    }

    return new ValidationStub()
}

const makeSut = () : SutTypes => {
    const validationStub = makeValidation()
    const sut = new AddSurveyController(validationStub)
    return { 
        sut,
        validationStub
    }

}

describe("AddSurvey Controller", () => {
    test("Should call Validation with correct values", async () => {
    
        const { sut, validationStub} = makeSut()
        const validateSpy = jest.spyOn(validationStub, 'validate')
        const httpRequest = makeFakeRequest()
        await sut.handle(httpRequest)
        
        expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })
})