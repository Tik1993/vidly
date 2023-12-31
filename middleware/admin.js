module.exports = function(req, res, next){
    //401 Unauthorized (check valid json web token)
    //403 Forbidden

    if(!req.user.isAdmin) return res.status(403).send('Access denied.')
    next()
}