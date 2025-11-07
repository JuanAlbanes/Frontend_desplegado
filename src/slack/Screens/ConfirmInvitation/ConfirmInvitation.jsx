import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import Swal from 'sweetalert2'
import ENVIRONMENT from '../../../config/environment.js'
import './ConfirmInvitation.css'

export default function ConfirmInvitation() {
    const { token } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const confirmInvitation = async () => {
            try {
                setLoading(true)
                
                console.log('🔗 Procesando token de invitación:', token)
                console.log('🌐 URL API:', ENVIRONMENT.URL_API)
                
                const response = await fetch(`${ENVIRONMENT.URL_API}/api/members/confirm-invitation/${token}`)
                
                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.message || 'Error al confirmar la invitación')
                }

                const result = await response.json()
                console.log('✅ Respuesta del backend:', result)
                
                if (result.success && result.redirectUrl) {
                    console.log('🎯 Redirigiendo según backend:', result.redirectUrl)
                    
                    const url = new URL(result.redirectUrl)
                    const workspaceId = url.searchParams.get('workspace_id')
                    const email = url.searchParams.get('email')
                    
                    console.log('📧 Email de invitación:', email)
                    console.log('🏢 Workspace ID:', workspaceId)
                    
                    await Swal.fire({
                        title: '¡Invitación aceptada!',
                        text: 'Ya eres miembro del workspace. Ahora inicia sesión.',
                        icon: 'success',
                        confirmButtonColor: '#611f69',
                        showConfirmButton: true
                    })
                    
                    navigate(`/login?invitation=success&workspace_id=${workspaceId || ''}&email=${email || ''}`)
                    
                } else {
                    await Swal.fire({
                        title: 'Invitación procesada',
                        text: 'Ya puedes iniciar sesión',
                        icon: 'info',
                        confirmButtonColor: '#611f69'
                    })
                    navigate('/login?invitation=success')
                }
                
            } catch (error) {
                console.error('❌ Error confirmando invitación:', error)
                setError(error.message)
                
                await Swal.fire({
                    title: 'Error en la invitación',
                    text: error.message || 'No se pudo aceptar la invitación',
                    icon: 'error',
                    confirmButtonColor: '#611f69'
                })

                navigate('/login?invitation=error')
            } finally {
                setLoading(false)
            }
        }

        if (token) {
            confirmInvitation()
        } else {
            setError('Token de invitación no válido')
            setLoading(false)
        }
    }, [token, navigate])

    if (loading) {
        return (
            <div className="confirm-invitation-container">
                <div className="loading-spinner">
                    <h2>Procesando invitación...</h2>
                    <p>Uniéndote al workspace, por favor espera</p>
                    <div className="spinner"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="confirm-invitation-container">
                <div className="error-message">
                    <h2>Error en la invitación</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate('/login')} className="btn-primary">
                        Ir al Login
                    </button>
                </div>
            </div>
        )
    }

    return null
}