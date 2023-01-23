export default function (err, req, res, next) {
    console.log('my fuckie: ', err)
    res.status(500).send('we made a fuckie wuckie')
    next()
}