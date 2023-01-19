import Joi from "joi";
import mongoose from "mongoose";
import { Card, CARD_TYPES } from "./card";

const MIN_COLLECTION_NAME_LENGTH = 3

// mongoose schema
const csm = {
    name: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return v && v.length > MIN_COLLECTION_NAME_LENGTH
            }
        }
    }
}

// joi schema
const vsm = {
    name: Joi.string()
}

CARD_TYPES.forEach(type => {
    csm[type] = {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: Card
        }],
        validate: {
            validator: function(v) {
                return v && v.length > 0
            }
        }
    }
})

const collectionSchema = mongoose.Schema(scm)
const Collection = mongoose.model('Collection', collectionSchema)

const validationSchema = Joi.object(vsm)

export {Collection, validationSchema}