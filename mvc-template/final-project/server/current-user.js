const CurrentUser = (() => {
    let currentUser = ""
    let currentRole = "guest"

    const login = (user, role) => {
        if(currentUser === "" || currentRole === "guest"){
            currentUser = user
            currentRole = role
        }
    }

    const signOut = () => {
        currentUser = ""
        currentRole = "guest"
    }

    return {
        login: login, 
        signOut: signOut,
        getUsername: () => currentUser,
        getRole: () => currentRole
    }
})()
module.exports = CurrentUser