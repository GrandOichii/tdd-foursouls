import request from 'supertest'
import mongoose from 'mongoose'
import { app, server } from '../..'
import {User} from '../../models/user'
import _ from 'lodash'
import shutdown from '../../shutdown'

describe('users', () => {
    
    beforeEach(async () => {
        await User.deleteMany({})
    })

    async function createUser(user, code=200) {
        await request(app).post('/api/users').send(user)
            .expect(code)
    }

    describe('GET', () => {
        it('should return all users', async() => {
            const response = await request(app).get('/api/users')
                .expect(200)

            expect(response.body.length).not.toBeUndefined()
        })

    })

    describe('POST', () => {
        const userMold = {login: 'example', password: 'pass', email: 'example@mail.com'}
        
        it('should be able to create a user', async() => {
            await createUser(userMold)
        })

        const fields = ['login', 'password', 'email']
        fields.forEach(async field => {
            const f = _.remove(fields, field)
            const user = _.pick(userMold, f)
            it(`should fail creating user with no ${field}`, async() => {
                await createUser(user, 400)
            })
        })

        it('should not create user with invalid email', async() => {
            await createUser({login: 'login', password: 'pass', email: 'mail'}, 400)
        })
        
        it('should not create user with the same login', async() => {
            await createUser({login: 'example1', password: 'pass', email: 'example1@mail.com'})
            await createUser({login: 'example1', password: 'pass', email: 'example2@mail.com'}, 400)
        })
        
        it('should not create user with the same email', async() => {
            await createUser({login: 'example1', password: 'pass', email: 'example1@mail.com'})
            await createUser({login: 'example2', password: 'pass', email: 'example1@mail.com'}, 400)
        })

        fields.forEach(field => {
            const f = _.remove(fields, field)
            const user = _.pick(userMold, f)
            user[field] = ''
            it (`should not create user with empty ${field}`, async() => {
                await createUser(user, 400)
            })
        })
    })


    afterAll(async() => {
        await User.deleteMany({})
        await shutdown()
    })
})