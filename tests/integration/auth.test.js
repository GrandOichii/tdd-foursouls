import request from "supertest"
import mongoose from "mongoose"
import { app, server } from "../../index"
import { User } from "../../models/user"
import jwt from 'jsonwebtoken'
import shutdown from '../../shutdown'

describe('/api/auth', () => {

    async function createUser(user, code=200) {
        await request(app).post('/api/users').send(user)
            .expect(code)
    }

    beforeEach(async () => {
        await User.deleteMany({})
    })
    
    it('should create and authenticate the user', async() => {
        await createUser({login: 'login', password: 'password', email: 'example@mail.com'})
        await request(app).post('/api/auth').send({login: 'login', password: 'password'}).expect(200)
    })
    
    it('shouldn\'t authenticate user with no login', async() => {
        await createUser({login: 'login', password: 'password', email: 'example@mail.com'})
        await request(app).post('/api/auth').send({password: 'password'}).expect(400)
    })

    it('shouldn\'t authenticate a non-existing user', async() => {
        // login with no users
        await request(app).post('/api/auth').send({login: 'login', password: 'pass'})
            .expect(403)
        // login with existing users
        await createUser({login: 'login', password: 'password', email: 'example@mail.com'})
        
        await request(app).post('/api/auth').send({login: 'login', password: 'pass'})
            .expect(403)
    })

    afterAll(async () => {
        await User.deleteMany({})
        await shutdown()
    })

})