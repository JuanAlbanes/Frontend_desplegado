import { Link, useParams } from "react-router"
import "./ChatHeader.css"
import { FaArrowLeft } from "react-icons/fa6"
import { IoChatbubbleEllipses, IoBusiness } from "react-icons/io5"
import { useContext, useState, useEffect } from "react"
import { MessagesContext } from "../../Context/MessagesContext"
import { getChannelById } from "../../services/channelService"

export default function ChatHeader({ workspace }) {
    const { workspace_id } = useParams()
    const { currentChannelId } = useContext(MessagesContext)
    const [currentChannel, setCurrentChannel] = useState(null)
    const [loadingChannel, setLoadingChannel] = useState(false)

    useEffect(() => {
        if (currentChannelId && workspace_id) {
            loadChannelInfo(workspace_id, currentChannelId)
        } else {
            setCurrentChannel(null)
        }
    }, [currentChannelId, workspace_id])

    const loadChannelInfo = async (workspaceId, channelId) => {
        setLoadingChannel(true)
        try {
            const response = await getChannelById(workspaceId, channelId)
            if (response.data && response.data.channel) {
                setCurrentChannel(response.data.channel)
            }
        } catch (error) {
            console.error('Error loading channel info:', error)
            setCurrentChannel(null)
        } finally {
            setLoadingChannel(false)
        }
    }

    if (!workspace) {
        return (
            <div className="chat-header">
                <Link to="/home" className="btn-back">
                    <FaArrowLeft />
                </Link>
                <div className="workspace-header-info">
                    <h2 className="workspace-header-name">Selecciona un workspace</h2>
                </div>
            </div>
        )
    }

    return (
        <div className="chat-header">
            <Link to="/home" className="btn-back">
                <FaArrowLeft />
            </Link>

            <div className="workspace-header-icon">
                {workspace.url_image ? (
                    <img 
                        src={workspace.url_image} 
                        alt={workspace.name}
                        className="workspace-header-image"
                        onError={(e) => {
                            e.target.style.display = 'none'
                        }}
                    />
                ) : (
                    <IoBusiness className="workspace-header-default-icon" />
                )}
            </div>
            
            <div className="workspace-header-info">
                <h2 className="workspace-header-name">
                    {currentChannel 
                        ? `#${currentChannel.name}` 
                        : workspace.name
                    }
                </h2>
                <p className="workspace-header-description">
                    {currentChannel 
                        ? (currentChannel.description || `Canal ${currentChannel.name}`)
                        : (workspace.description || `Workspace ${workspace.name}` ) 
                    } 
                    {loadingChannel && " (cargando...)"}
                </p>
            </div>
        </div>
    )
}