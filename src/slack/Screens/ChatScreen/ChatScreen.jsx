import { useContext, useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { MessagesContext } from "../../context/MessagesContext"
import { WorkspaceContext } from "../../context/WorkspaceContext"
import ChatHeader from "../../components/ChatHeader/ChatHeader"
import Chat from "../../components/Chat/Chat"
import NewMessageForm from "../../components/NewMessageForm/NewMessageForm"
import WorkspaceList from "../../components/WorkspaceList/WorkspaceList"
import ChannelList from "../../components/ChannelList/ChannelList"
import LoaderSpinner from "../../components/LoaderSpinner/LoaderSpinner"
import SlackLayout from "../../components/Layout/SlackLayout"
import "./ChatScreen.css"

export default function ChatScreen() {
    const { workspace_id } = useParams()
    const { loadMessages, isMessagesLoading, currentChannelId } = useContext(MessagesContext)
    const { workspaces, loadWorkspaces } = useContext(WorkspaceContext)
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('workspaces')
    const [error, setError] = useState(null)

    // Cargar workspaces si no están cargados
    useEffect(() => {
        if (workspaces.length === 0 && loadWorkspaces) {
            loadWorkspaces().catch(err => {
                console.error('Error cargando workspaces:', err)
                setError('Error al cargar los workspaces')
            })
        }
    }, [workspaces.length, loadWorkspaces])

    // Encontrar el workspace actual usando _id (MongoDB)
    const currentWorkspace = workspaces.find((w) => w._id === workspace_id)

    const handleWorkspaceSelect = (workspace) => {
        const workspaceId = workspace._id
        navigate(`/workspace/${workspaceId}`)
        setActiveTab('channels')
        setError(null) // Limpiar error al cambiar de workspace
    }

    const handleChannelSelect = (channel) => {
        setActiveTab('channels')
        setError(null) // Limpiar error al seleccionar canal
    }

    // Manejar errores de carga
    useEffect(() => {
        if (error) {
            console.error('Error en ChatScreen:', error)
        }
    }, [error])

    const sidebarContent = (
        <div className="chat-sidebar">
            <div className="sidebar-tabs">
                <button 
                    className={`tab-button ${activeTab === 'workspaces' ? 'active' : ''}`}
                    onClick={() => {
                        setActiveTab('workspaces')
                        setError(null)
                    }}
                >
                    Workspaces
                </button>
                <button 
                    className={`tab-button ${activeTab === 'channels' ? 'active' : ''}`}
                    onClick={() => {
                        if (workspace_id) {
                            setActiveTab('channels')
                            setError(null)
                        }
                    }}
                    disabled={!workspace_id}
                >
                    Canales
                </button>
            </div>
            
            <div className="sidebar-content">
                {error && (
                    <div className="error-message">
                        <p>{error}</p>
                        <button onClick={() => setError(null)}>Cerrar</button>
                    </div>
                )}
                
                {activeTab === 'workspaces' ? (
                    <WorkspaceList 
                        currentWorkspaceId={workspace_id} 
                        onWorkspaceSelect={handleWorkspaceSelect} 
                    />
                ) : (
                    workspace_id ? (
                        <ChannelList 
                            workspaceId={workspace_id}
                            onChannelSelect={handleChannelSelect}
                            onError={setError}
                        />
                    ) : (
                        <div className="no-workspace-selected">
                            <p>Selecciona un workspace primero</p>
                        </div>
                    )
                )}
            </div>
        </div>
    )

    // Mostrar spinner solo si estamos cargando mensajes Y tenemos un canal seleccionado
    if (isMessagesLoading && currentChannelId) {
        return <LoaderSpinner />
    }

    return (
        <SlackLayout sidebarContent={sidebarContent}>
            <div className="chat-screen">
                <ChatHeader workspace={currentWorkspace} />
                {currentChannelId ? (
                    <>
                        <Chat />
                        <NewMessageForm />
                    </>
                ) : (
                    <div className="no-channel-selected">
                        <div className="no-channel-content">
                            <h3>Bienvenido a {currentWorkspace?.name || 'Slack'}</h3>
                            <p>Selecciona un canal para empezar a chatear</p>
                            {!workspace_id && (
                                <p>O selecciona un workspace primero</p>
                            )}
                            {error && (
                                <div className="error-banner">
                                    <p>Error: {error}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </SlackLayout>
    )
}