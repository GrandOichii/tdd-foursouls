import express from 'express'
import { loginSchema, User } from '../models/user.js'
import bcrypt from 'bcrypt'


const router = express.Router()

router.post('', async (req, res) => {
    const {error} = loginSchema.validate(req.body)
    if (error) return res.status(400).send(error)
    
    const users = await User.find().select('+password')
    const user = await User.findOne({login: req.body.login}).select('+password')

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) return res.status(403).send({message: 'Wrong login or password'})
    
    res.send(user.genAuthToken())    
})

export default router