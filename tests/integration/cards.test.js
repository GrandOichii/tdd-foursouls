import mongoose from 'mongoose'
import request from 'supertest'

import {app, server} from '../../index'
import {Card, CARD_TYPES} from '../../models/card'
import shutdown from '../../shutdown'


describe('/api/cards', () => {

    async function postCard(card) {
        const response = await request(app).post('/api/cards').send(card)
            .expect(200)
        expect(response.body).toMatchObject(card)
    }

    async function badPost(card) {
        await request(app).post('/api/cards').send(card)
            .expect(400)
    }
    

    beforeEach(async () => {
        // remove all cards
        await Card.deleteMany({})
    })

    describe('GET', () => {
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
        
    })

    describe('POST', () => {
        it('should post a card', async () => {
            const card = {name: '4 cents!', text: 'Gain 4$.', ctype: 'loot'}

            // post card
            await postCard(card)

            // fetch cards, amount should be 1
            const response = await request(app).get('/api/cards')
                .expect(200)
            expect(response.body.length).toBe(1)
            // expect(response.body).toMatchObject(card)
        })

        it('should return 400 when posting bad card', async () => {
            await badPost({})
            await badPost({name: 'c1', text: 't1'})
            await badPost({ctype: 'loot', text: 't1'})
            await badPost({ctype: 'loot', text: 't1'})
            await badPost({name: 'n1', ctype: '-', text: 't1'})
        })
    })

    afterAll(async () => {
        await Card.deleteMany({})
        await shutdown()
    })

})