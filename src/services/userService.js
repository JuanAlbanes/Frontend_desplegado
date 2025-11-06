import ENVIRONMENT from "../config/environment.js"
import { CONTENT_TYPE_VALUES, HEADERS, HTTP_METHODS } from "../constants/http.js"
import { getToken } from "./authService.js"

export async function getCurrentUser() {
    const token = getToken()
    
    if (!token) {
        console.warn('No hay token disponible')
        return null
    }

    try {
        const response_http = await fetch(
            `${ENVIRONMENT.URL_API}/api/auth/me`,
            {
                method: HTTP_METHODS.GET,
                headers: {
                    [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                    Authorization: `Bearer ${token}`
                }
            }
        )

        const response_data = await response_http.json()

        if (!response_http.ok) {
            throw new Error(response_data.message || `Error HTTP: ${response_http.status}`)
        }

        if (!response_data.ok) {
            throw new Error(response_data.message)
        }

        return response_data.data.user
    } catch (error) {
        console.error('Error obteniendo usuario actual:', error)
        return null
    }
}