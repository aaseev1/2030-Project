const User = (username, hashed) => {
    const Role = {
        ADMIN: 'admin',
        MEMBER: 'member',
        GUEST: 'guest'
    }
    let userRole;
    if(username === ""){
        userRole = Role.GUEST
    }else{
        userRole = Role.MEMBER
    }
    return {
        username: username,
        password: hashed,
        role: userRole,
        since: new Date().toUTCString()
    }
}
module.exports = User