import mongoose from 'mongoose'
import Joi from 'joi'
import jwt from 'jsonwebtoken'
import config from 'config'

const MIN_LOGIN_LENGTH = 3
const EMAIL_VALIDATOR = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// mongoose model
const userSchema = mongoose.Schema({
    login: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: function(v) {
                return v && v.length > MIN_LOGIN_LENGTH
            }
        }
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    email: {
        type: String,
        required: true,
        select: false,
        unique: true,
        validate: {
            validator: function(v) {
                return (!v || EMAIL_VALIDATOR.test(v))
            },
            message: 'Provided email is invalid'
        },
    }
})
userSchema.methods.genAuthToken = function() {
    return jwt.sign({_id: this._id, login: this.login}, config.get('jwtKey'))
}
const User = mongoose.model('User', userSchema)

// joi registration schema
const validationSchema = Joi.object({
    login: Joi.string().required().min(MIN_LOGIN_LENGTH),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(3)
})

// joi login schema
const loginSchema = Joi.object({
    login: Joi.string().required().min(MIN_LOGIN_LENGTH),
    password: Joi.string().required().min(3)
})

export {User, validationSchema, loginSchema}