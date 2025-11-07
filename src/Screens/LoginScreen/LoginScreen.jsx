import React, { useEffect } from 'react'
import useFetch from '../../hooks/useFetch.jsx'
import useForm from '../../hooks/useForm.jsx'
import { login } from '../../services/authService.js'
import { useNavigate } from 'react-router'
import { Link } from 'react-router'
import './LoginScreen.css'

const FORM_FIELDS = {
    EMAIL: 'email',
    PASSWORD: 'password'
}

const initial_form_state = {
    [FORM_FIELDS.EMAIL]: '',
    [FORM_FIELDS.PASSWORD]: ''
}

export const LoginScreen = () => {

    const navigate = useNavigate()

    const {
        sendRequest,
        loading,
        response,
        error
    } = useFetch()

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

    useEffect(
        () => {
            console.log('Login response:', response)
            
            if (response && response.ok === true) {
                console.log('Login exitoso, redirigiendo...')
                navigate('/workspace')
            } else if (response && response.ok === false) {
                console.log('Login fallido:', response.message)
            }
        },
        [response, navigate]
    )

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