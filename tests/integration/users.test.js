import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../index'
import { createUser } from '../util'
import _ from 'lodash'
import shutdown from '../../shutdown'
import { User } from '../../models/user'

describe('users', () => {
    
    beforeEach(async () => {
        await User.deleteMany({})
    })

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
            await createUser(app, userMold)
        })

        const fields = ['login', 'password', 'email']
        fields.forEach(async field => {
            const f = _.remove(fields, field)
            const user = _.pick(userMold, f)
            it(`should fail creating user with no ${field}`, async() => {
                await createUser(app, user, 400)
            })
        })

        it('should not create user with invalid email', async() => {
            await createUser(app, {login: 'login', password: 'pass', email: 'mail'}, 400)
        })
        
        it('should not create user with the same login', async() => {
            await createUser(app, {login: 'example1', password: 'pass', email: 'example1@mail.com'})
            await createUser(app, {login: 'example1', password: 'pass', email: 'example2@mail.com'}, 400)
        })
        
        it('should not create user with the same email', async() => {
            await createUser(app, {login: 'example1', password: 'pass', email: 'example1@mail.com'})
            await createUser(app, {login: 'example2', password: 'pass', email: 'example1@mail.com'}, 400)
        })

        fields.forEach(field => {
            const f = _.remove(fields, field)
            const user = _.pick(userMold, f)
            user[field] = ''
            it (`should not create user with empty ${field}`, async() => {
                await createUser(app, user, 400)
            })
        })
    })


    afterAll(async() => {
        await User.deleteMany({})
        await shutdown()
    })
})