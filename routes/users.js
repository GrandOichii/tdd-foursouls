import bcrypt from 'bcrypt'
import express from 'express'
import { User, validationSchema } from '../models/user'

const router = express.Router()

router.get('', async (req, res) => {
    const users = await User.find(req.query)
    res.send(users)
})

router.post('', async (req, res) => {
    let {error} = validationSchema.validate(req.body)
    if (error) return res.status(400).send(error)
    req.body.password = await bcrypt.hash(req.body.password, 10)
    const user = new User(req.body)
    try {
        await user.save()
        res.send(user)
    } catch (ex) {res.status(400).send(error)}
})

export default router