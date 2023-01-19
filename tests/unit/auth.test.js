import shutdown from "../../shutdown"
import {createUser} from '../util'
import {app} from '../../index'

describe('auth middleware', () => {

    it('shouldn\'t respond with an error when using real token', async() => {
        await createUser(app, {login: 'login1', email: 'mail@example.com', password: 'pass'})

    })

    afterAll(async () => {
        await shutdown()
    })
})