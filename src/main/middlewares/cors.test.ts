import request from 'supertest'
import app from '../config/app'


describe('Cors Middleware', () => {
    test('Should enable cors', async() => {

        app.post('/test_cors', (request,response) => {
            response.send()
        })

        await request(app)
        .post('/test_cors')
        .expect('acess-control-allow-origin', '*')
        .expect('acess-control-allow-methods', '*')
        .expect('acess-control-allow-headers', '*')
        
    })
})