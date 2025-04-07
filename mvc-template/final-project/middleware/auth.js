const CurrentUser = require('../server/current-user')

const authorizeRole = (role) => {
    return (req, res, next) => {
        const currentRole = CurrentUser.getRole()
        console.log(`Authorizing: required=${role}, current=${currentRole}`)

        // req.user = {
        //     username: username,
        //     role: CurrentUser.getRole()
        // }
        // next()

        if (currentRole !== role) {
            return res.status(403).send(`Access denied. ${role} only.`)
        }
        next()
    }
}

module.exports = {
    authorizeAdmin: authorizeRole('admin'),
    authorizeMember: authorizeRole('member'),
    authorizeGuest: authorizeRole('guest'),
}