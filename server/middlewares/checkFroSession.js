module.exports = (req, res, next) => {
    if(req.session.user) {
        req.session.usedMiddleware = true
        res.status(200).send(req.session)
    }else {
        next()
    }
}