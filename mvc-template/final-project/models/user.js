const User = (username, hashed) => {
    const Role = {
        ADMIN: 'admin',
        MEMBER: 'member',
        GUEST: 'guest'
    }
    let userRole;
    if(username === ""){
        userRole = Role.GUEST //Default if username is empty
    }else{
        userRole = Role.MEMBER //Default if username is provided
    }
    return {
        username: username,
        password: hashed,
        role: userRole,
        since: new Date().toUTCString() //Records new user date
    }
}
module.exports = User