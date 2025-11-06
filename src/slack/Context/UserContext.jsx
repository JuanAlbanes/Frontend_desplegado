import { createContext, useState, useEffect } from "react"
import { getCurrentUser } from "../../services/userService.js"
import { isAuthenticated } from "../../services/authService.js"

export const UserContext = createContext({
    currentUser: null,
    isLoading: true,
    loadCurrentUser: () => {}
})

const UserContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const loadCurrentUser = async () => {
        if (!isAuthenticated()) {
            setCurrentUser(null)
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        try {
            const user = await getCurrentUser()
            setCurrentUser(user)
        } catch (error) {
            console.error('Error loading current user:', error)
            setCurrentUser(null)
        } finally {
            setIsLoading(false)
        }
    }

    // Cargar usuario al iniciar
    useEffect(() => {
        loadCurrentUser()
    }, [])

    return (
        <UserContext.Provider
            value={{
                currentUser,
                isLoading,
                loadCurrentUser
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider