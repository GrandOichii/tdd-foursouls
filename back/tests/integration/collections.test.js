import request from 'supertest'
import {app} from '../../index'
import {createUser} from '../util'
import shutdown from '../../shutdown'
import { Card } from '../../models/card'
import { Collection } from '../../models/collection'

describe('/api/collections', () => {
    let token = ''

    async function createCard(name, text, type, code) {
        const response = await request(app).post('/api/cards')
            .send({name: name, text: text, ctype: type})
            .set('x-auth-token', token)
            .expect(code)
        return response.body
    }

    async function getMe() {
        const response = await request(app).get('/api/me')
            .set('x-auth-token', token)
            .expect(200)
        return response.body
    }

    async function createCollection(name, lootCount, monsterCount, treasureCount, code=200, cardCode=200) {
        // TODO
        const cs = {name: name}
        for (let [key, value] of new Map([['loot', lootCount], ['monster', monsterCount], ['treasure', treasureCount]])) {
            cs[value] = []
            for (let i = 0; i < value; i++) {
                const card = await createCard(`${key}${i}`, 'text', key, cardCode)
                cs[value].push(card._id)
            }
        }
        const response = await request(app).post('/api/collections')
            .send(cs)
            .set('x-auth-token', token)
            .expect(code)
        return response ? response.body : undefined
    }

    // it('moguse', () => {
    //     expect(1).toBe(1)
    // })

    describe('GET', () => {
        
        it('should return all collections', async() => {
            const response = await request(app).get('/api/collections').expect(200)
            
            expect(response.body.length).not.toBeUndefined()
        })
        
        it('shouldn\'t create collection without logging in', async() => {
            await createCollection('col1', 1, 1, 1, 401, 401)
        })

        describe('with valid token', () => {
            beforeAll(async () => {
                await createUser(app, {login: 'login', email: 'example@mail.com', password: 'pass'})
                const resp = await request(app).post('/api/auth').send({login: 'login', password: 'pass'}).expect(200)
                token = resp.text
            })
                        
            it('should create a collection', async() => {
                await createCollection('col1', 3, 3, 3)
            })

            it('should return collections by query', async() => {
                await createCollection('col1', 1, 1, 1)
                await createCollection('col2', 1, 1, 1)
                await createCollection('col3', 1, 1, 1)
                const resp = await request(app).get('/api/collections').query({name: 'col1'}).expect(200)
                expect(resp.body.length).toBe(1)
            })
    
            afterEach(async () => {
                await Card.deleteMany({})
                await Collection.deleteMany({})
            })
        })
    })

    afterAll(async () => {
        await Collection.deleteMany({})
        await shutdown()
    })
})