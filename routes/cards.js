import express from 'express'
import { Card, CARD_TYPES, validationSchema} from '../models/card.js'

const router = express.Router()

router.get('', async (req, res) => {
    const cards = await Card.find(req.query)
    res.send(cards)
})

CARD_TYPES.forEach(type => {
    router.get(`/${type}`, async (req, res) => {
        const cards = await Card.find({ctype: type})
        res.send(cards)
    })
})

router.post('', async(req, res) => {
    const {error} = validationSchema.validate(req.body)
    if (error) return res.status(400).send(error)

    const card = new Card(req.body)
    await card.save()
    res.send(card)
})

export default router