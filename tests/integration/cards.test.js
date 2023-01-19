import mongoose from 'mongoose'
import request from 'supertest'

import {createUser} from '../util'
import {app} from '../../index'
import {Card, CARD_TYPES} from '../../models/card'
import shutdown from '../../shutdown'
import { User } from '../../models/user'


describe('/api/cards', () => {

    let token = ''

    async function postCard(card, code=200) {
        const response = await request(app).post('/api/cards').set('x-auth-token', token).send(card)
            .expect(code)
        if (('' + code).startsWith('4')) return
        expect(response.body).toMatchObject(card)
    }

    describe('GET', () => {
        beforeAll(async () => {
            await createUser(app, {login: 'login', email: 'example@mail.com', password: 'pass'})
            const resp = await request(app).post('/api/auth').send({login: 'login', password: 'pass'}).expect(200)
            token = resp.text
        })

        it('should return all cards', async () => {
            const response = await request(app).get('/api/cards')
                .expect(200)
            expect(response.body.length).not.toBeUndefined()
        })

        it('should return cards by query', async () => {
            // populate db
            await postCard({name: 'c1', text: 'text1', ctype: 'loot'})
            await postCard({name: 'c2', text: 'text2', ctype: 'treasure'})
            await postCard({name: 'c3', text: 'text3', ctype: 'loot'})

            // expect response length to be 2
            const response = await request(app).get('/api/cards')
                .query({ctype: 'loot'})
                .expect(200)
            expect(response.body.length).toBe(2)
        })

        CARD_TYPES.forEach(type => {
            const path = `/api/cards/${type}`
            it(`should return cards of type ${type} (${path})`, async () => {
                await request(app).get(path)
                    .expect(200)
            })
        })

        afterEach(async () => {
            Card.deleteMany({})
        })
        
        afterAll(async () => {
            User.deleteMany({})
        })
        
    })

    describe('POST', () => {
        const basicCard = {name: '4 cents!', text: 'Gain 4$.', ctype: 'loot'}

        beforeAll(() => {
            token = ''
        })

        it('shouldn\'t post card without a token', async() => {
            await postCard(basicCard, 401)
        })

        describe('with valid token', () => {
            beforeAll(async () => {
                await User.deleteMany({})
                await Card.deleteMany({})
                await createUser(app, {login: 'login', email: 'example@mail.com', password: 'pass'})
                const resp = await request(app).post('/api/auth').send({login: 'login', password: 'pass'}).expect(200)
                token = resp.text
            })

            it('should post a card', async () => {
    
                // post card
                await postCard(basicCard)
    
                // fetch cards, amount should be 1
                const response = await request(app).get('/api/cards')
                    .expect(200)
                expect(response.body.length).toBe(1)
                // expect(response.body).toMatchObject(card)
            })
    
            it('should return 400 when posting bad card', async () => {
                await postCard({}, 400)
                await postCard({name: 'c1', text: 't1'}, 400)
                await postCard({ctype: 'loot', text: 't1'}, 400)
                await postCard({ctype: 'loot', text: 't1'}, 400)
                await postCard({name: 'n1', ctype: '-', text: 't1'}, 400)
            })

            afterAll(async () => {
                await User.deleteMany({})
            })
        })

        afterAll(async () => {
            // remove all cards
            await Card.deleteMany({})
        })
    


    })

    afterAll(async () => {
        await Card.deleteMany({})
        await shutdown()
    })

})