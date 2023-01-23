import cardsRouter from './routes/cards.js'
import usersRouter from './routes/users.js'
import authRouter from './routes/auth.js'
import error from './middleware/error.js'

export default function(app) {
    app.use('/api/cards', cardsRouter)
    app.use('/api/users', usersRouter)
    app.use('/api/auth', authRouter)

    app.use(error)
}