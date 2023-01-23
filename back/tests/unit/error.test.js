import jest from 'jest-mock'
import error from '../../middleware/error'

describe('error middleware', () => {
    it('should return status 500', () => {
        let errorCode = 0
        const err = new Error('mock error')
        const req = {}
        const res = {}
        res.status = jest.fn(ec => {
            errorCode = ec
            return res
        })
        res.send = jest.fn()

        const next = jest.fn()

        error(err, req, res, next)
        expect(next).toBeCalled()
        expect(errorCode).toBe(500)
        expect(res.status).toBeCalled()
        expect(res.send).toBeCalled()
    })
})