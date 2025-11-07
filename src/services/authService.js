import ENVIRONMENT from "../config/environment.js"
import { CONTENT_TYPE_VALUES, HEADERS, HTTP_METHODS } from "../constants/http.js"

export async function register(name, email, password, invitationWorkspaceId = null) { 
    const usuario = {
        username: name,  
        email,
        password,
        invitationWorkspaceId  
    }
    
    console.log('📝 Enviando registro con datos:', usuario)
    
    try {
        const response_http = await fetch(
            `${ENVIRONMENT.URL_API}/api/auth/register`,
            {
                method: HTTP_METHODS.POST,
                headers: {
                    [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON
                },
                body: JSON.stringify(usuario)
            }
        )
        
        const response_data = await response_http.json()
        
        if (!response_http.ok) {
            throw new Error(response_data.message || `Error HTTP: ${response_http.status}`)
        }
        
        if (!response_data.ok) {
            throw new Error(response_data.message)
        }
        
        return response_data
    } catch (error) {
        console.error('Error in register:', error)
        throw error
    }
}

export async function login(email, password) {
    try {
        console.log('🔐 Iniciando proceso de login para:', email)
        
        const response = await fetch(
            `${ENVIRONMENT.URL_API}/api/auth/login`,
            {
                method: HTTP_METHODS.POST,
                headers: {
                    [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                },
                body: JSON.stringify({ email, password })
            }
        )
        
        const response_data = await response.json()
        
        console.log('📨 Login response:', response_data) 
        
        if (!response.ok) {
            throw new Error(response_data.message || `Error HTTP: ${response.status}`)
        }
        
        if (!response_data.ok) {
            throw new Error(response_data.message || 'Error en la autenticación')
        }
        
        if (response_data.data && response_data.data.authorization_token) {
            localStorage.setItem('token', response_data.data.authorization_token)
            console.log('✅ Token guardado correctamente')
        } else {
            console.warn('⚠️ No se recibió token en la respuesta:', response_data)
        }
        
        return response_data
    } catch (error) {
        console.error('❌ Error in login:', error)
        throw error
    }
}

export async function resetPassword(email, newPassword) {
    try {
        const response = await fetch(
            `${ENVIRONMENT.URL_API}/api/auth/reset-password`,
            {
                method: HTTP_METHODS.PUT,
                headers: {
                    [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                },
                body: JSON.stringify({ email, newPassword })
            }
        )
        
        const response_data = await response.json()
        
        if (!response.ok) {
            throw new Error(response_data.message || `Error HTTP: ${response.status}`)
        }
        
        if (!response_data.ok) {
            throw new Error(response_data.message)
        }
        
        return response_data
    } catch (error) {
        console.error('Error in resetPassword:', error)
        throw error
    }
}

export function getToken() {
    const token = localStorage.getItem('token')
    if (!token) {
        console.warn('No se encontró token en localStorage')
    }
    return token
}

export function isAuthenticated() {
    const token = localStorage.getItem('token')
    const authenticated = !!token
    console.log('Usuario autenticado:', authenticated)
    return authenticated
}