import request from 'supertest'
import {app} from '../../index'
import {createUser} from '../util'
import shutdown from '../../shutdown'
import { Collection } from 'mongoose'
import { Card } from '../../models/card'

describe('/api/collections', () => {
    let token = ''

    async function createCollection() {
        // TODO
    }

    describe('GET', () => {
        beforeEach(async () => {
            await Collection.deleteMany({})
        })

        it('should return all collections', async() => {
            const response = await request(app).get('/api/collections').expect(200)

            expect(response.body.length).not.toBeUndefined()
        })

        describe('with valid token', () => {
            beforeAll(async () => {
                await createUser(app, {login: 'login', email: 'example@mail.com', password: 'pass'})
                const resp = await request(app).post('/api/auth').send({login: 'login', password: 'pass'}).expect(200)
                token = resp.text
            })

            beforeEach(async() => {
                await Collection.deleteMany({})
                await Card.deleteMany({})
            })

            it('should return collections by query', async() => {
                // const resp = await request(app).get
            })
        })
    })

    afterAll(async () => {
        Collection.deleteMany({})
        await shutdown()
    })
})