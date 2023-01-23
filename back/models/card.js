import mongoose from 'mongoose'
import Joi from 'joi'

const CARD_TYPES = ['loot', 'treasure', 'monster']

// mongoose model
const cardSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    text: {
        type: String,
        default: ''
    },
    ctype: {
        type: String,
        required: true,
        enum: CARD_TYPES
    }
})
const Card = mongoose.model('Card', cardSchema)

// joi schema
const validationSchema = Joi.object({
    name: Joi.string().required().min(1),
    text: Joi.string().default(''),
    ctype: Joi.string().required().valid(...CARD_TYPES)
})

export {Card, validationSchema, CARD_TYPES}