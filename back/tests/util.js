import request from 'supertest'

async function createUser(app, user, code=200) {
    await request(app).post('/api/users').send(user)
        .expect(code)
}

export {createUser}