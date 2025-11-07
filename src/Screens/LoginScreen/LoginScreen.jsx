import React, { useEffect } from 'react'
import useFetch from '../../hooks/useFetch.jsx'
import useForm from '../../hooks/useForm.jsx'
import { login } from '../../services/authService.js'
import { useNavigate, useSearchParams } from 'react-router'
import { Link } from 'react-router'
import './LoginScreen.css'

const FORM_FIELDS = {
    EMAIL: 'email',
    PASSWORD: 'password'
}

export const LoginScreen = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const {
        sendRequest,
        loading,
        response,
        error
    } = useFetch()

    useEffect(() => {
        const invitationWorkspaceId = searchParams.get('workspace_id')
        const invitationEmail = searchParams.get('email')
        const isFromInvitation = searchParams.get('invitation')
        
        console.log('🔍 Parámetros URL detectados:', {
            invitationWorkspaceId,
            invitationEmail,
            isFromInvitation
        })
        
    }, [searchParams])

    const onLogin = async (form_state) => {
        try {
            await sendRequest(() => login(
                form_state[FORM_FIELDS.EMAIL],
                form_state[FORM_FIELDS.PASSWORD]
            ))
        } catch (error) {
            console.error('Login error:', error)
        }
    }

    useEffect(() => {
        console.log('📨 Login response:', response)
        
        if (response && response.ok === true) {
            console.log('✅ Login exitoso')
            
            const invitationWorkspaceId = searchParams.get('workspace_id')
            
            if (invitationWorkspaceId) {
                console.log('🎯 Redirigiendo al workspace invitado:', invitationWorkspaceId)
                navigate(`/workspace/${invitationWorkspaceId}`)
            } else {
                console.log('🚀 Redirigiendo a workspace normal')
                navigate('/workspace')
            }
            
        } else if (response && response.ok === false) {
            console.log('❌ Login fallido:', response.message)
        }
    }, [response, navigate, searchParams])

    const initial_form_state = {
        [FORM_FIELDS.EMAIL]: searchParams.get('email') || '',
        [FORM_FIELDS.PASSWORD]: ''
    }

    const {
        form_state: login_form_state,
        handleSubmit,
        handleInputChange
    } = useForm(
        {
            initial_form_state,
            onSubmit: onLogin
        }
    )

    return (
        <div className='global-container-login'>
            <div className="top-nav_btn">
                <Link to="/register" className="register-btn">Registrarse</Link>
            </div>
            <div className='container-login'>
            <h1>Iniciar Sesión</h1>
            
            {searchParams.get('invitation') === 'success' && (
                <div className="invitation-message">
                    <p>🎉 ¡Invitación aceptada! Inicia sesión para acceder al workspace.</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className='container-email'>
                    <label htmlFor={FORM_FIELDS.EMAIL}>Email:</label>
                    <input
                        name={FORM_FIELDS.EMAIL}
                        id={FORM_FIELDS.EMAIL}
                        type='email'
                        onChange={handleInputChange}
                        value={login_form_state[FORM_FIELDS.EMAIL]}
                        required
                    />
                </div>
                <div className='container-password'>
                    <label htmlFor={FORM_FIELDS.PASSWORD}>Contraseña:</label>
                    <input
                        name={FORM_FIELDS.PASSWORD}
                        id={FORM_FIELDS.PASSWORD}
                        type='password'
                        onChange={handleInputChange}
                        value={login_form_state[FORM_FIELDS.PASSWORD]}
                        required
                    />
                </div>
                {
                    !response
                        ?
                        <button type='submit' disabled={loading}>
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                        :
                        <>
                            <button type='submit' disabled={true}>Sesión Iniciada</button>
                            <span style={{ color: 'green' }}>{response.message}</span>
                        </>
                }
                {
                    error && <span style={{ color: 'red' }}>{error.message}</span>
                }
                
                <div className="reset-password-link">
                    <Link to="/reset-password" className="reset-password-btn">
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>
            </form>
            </div>
        </div>
    )
}