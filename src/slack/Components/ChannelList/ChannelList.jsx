import { useState, useEffect, useContext, useCallback } from "react"
import { MessagesContext } from "../../Context/MessagesContext.jsx"
import { getChannelsByWorkspace, createChannel, updateChannel, deleteChannel } from "../../services/channelService"
import useFetch from "../../../hooks/useFetch"
import "./ChannelList.css"
import { IoAdd, IoSearchSharp, IoLockClosed, IoSettings, IoTrash } from "react-icons/io5"
import Swal from "sweetalert2"

export default function ChannelList({ workspaceId, onChannelSelect }) {
    const { currentChannelId, loadMessages } = useContext(MessagesContext)
    const [channels, setChannels] = useState([])
    const [searchChannel, setSearchChannel] = useState("")
    const { loading, error, sendRequest } = useFetch()

    const loadChannels = useCallback(async (workspaceId) => {
        if (!workspaceId) {
            setChannels([])
            return
        }
        
        try {
            const response = await getChannelsByWorkspace(workspaceId)
            
            if (response && response.data && response.data.channels) {
                setChannels(response.data.channels)
            } else {
                setChannels([])
            }
        } catch (error) {
            console.error('Error cargando canales:', error)
            setChannels([])
        }
    }, [])

    useEffect(() => {
        if (workspaceId) {
            loadChannels(workspaceId)
        } else {
            setChannels([])
        }
    }, [workspaceId, loadChannels])

    const handleCreateChannel = () => {
        Swal.fire({
            title: "Crear nuevo canal",
            html: `
                <input id="channel-name" class="swal2-input" placeholder="Nombre del canal">
                <input id="channel-description" class="swal2-input" placeholder="Descripción (opcional)">
                <div style="text-align: left; margin: 10px 0;">
                    <label>
                        <input type="checkbox" id="channel-private" style="margin-right: 8px;">
                        Canal privado
                    </label>
                </div>
            `,
            confirmButtonText: "Crear",
            confirmButtonColor: "#611f69",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            background: "#ffffff",
            preConfirm: () => {
                const name = document.getElementById("channel-name").value
                const description = document.getElementById("channel-description").value
                const isPrivate = document.getElementById("channel-private").checked
                
                if (!name) {
                    Swal.showValidationMessage("El nombre del canal es requerido")
                }
                return { name, description, isPrivate }
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await createChannel(
                        result.value.name, 
                        result.value.description, 
                        workspaceId, 
                        result.value.isPrivate
                    )
                    
                    if (response.ok) {
                        await loadChannels(workspaceId)
                        
                        Swal.fire({
                            title: "Canal creado!",
                            text: `Canal "${result.value.name}" creado exitosamente`,
                            icon: "success",
                            confirmButtonColor: "#611f69",
                            timer: 2000,
                        })
                    } else {
                        throw new Error(response.message || 'Error al crear el canal')
                    }
                } catch (error) {
                    console.error('Error creando canal:', error)
                    Swal.fire({
                        title: "Error",
                        text: error.message || 'Error al crear el canal',
                        icon: "error",
                        confirmButtonColor: "#611f69",
                    })
                }
            }
        })
    }

    const handleEditChannel = (channel) => {
        Swal.fire({
            title: "Editar canal",
            html: `
                <input id="channel-name" class="swal2-input" placeholder="Nombre del canal" value="${channel.name}">
                <input id="channel-description" class="swal2-input" placeholder="Descripción (opcional)" value="${channel.description || ''}">
                <div style="text-align: left; margin: 10px 0;">
                    <label>
                        <input type="checkbox" id="channel-private" style="margin-right: 8px;" ${channel.private ? 'checked' : ''}>
                        Canal privado
                    </label>
                </div>
            `,
            confirmButtonText: "Actualizar",
            confirmButtonColor: "#611f69",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            background: "#ffffff",
            preConfirm: () => {
                const name = document.getElementById("channel-name").value
                const description = document.getElementById("channel-description").value
                const isPrivate = document.getElementById("channel-private").checked
                
                if (!name) {
                    Swal.showValidationMessage("El nombre del canal es requerido")
                }
                return { name, description, isPrivate }
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await sendRequest(async () => {
                        const response = await updateChannel(
                            channel._id,
                            result.value.name, 
                            result.value.description, 
                            result.value.isPrivate
                        )
                        if (response.ok) {
                            await loadChannels(workspaceId)
                            
                            Swal.fire({
                                title: "Canal actualizado!",
                                icon: "success",
                                confirmButtonColor: "#611f69",
                                timer: 1500,
                            })
                        }
                    })
                } catch (error) {
                    console.error('Error editando canal:', error)
                    Swal.fire({
                        title: "Error",
                        text: error.message,
                        icon: "error",
                        confirmButtonColor: "#611f69",
                    })
                }
            }
        })
    }

    const handleDeleteChannel = (channel) => {
        Swal.fire({
            title: "¿Eliminar canal?",
            text: `¿Estás seguro de que quieres eliminar el canal "${channel.name}"? Esta acción no se puede deshacer.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await sendRequest(async () => {
                        const response = await deleteChannel(channel._id)
                        if (response.ok) {
                            await loadChannels(workspaceId)
                            
                            Swal.fire({
                                title: "Canal eliminado!",
                                icon: "success",
                                confirmButtonColor: "#611f69",
                                timer: 1500,
                            })
                        }
                    })
                } catch (error) {
                    console.error('Error eliminando canal:', error)
                    Swal.fire({
                        title: "Error",
                        text: error.message,
                        icon: "error",
                        confirmButtonColor: "#611f69",
                    })
                }
            }
        })
    }

    const handleChannelClick = (channel) => {
        if (onChannelSelect) {
            onChannelSelect(channel)
        }
        if (workspaceId) {
            loadMessages(workspaceId, channel._id)
        }
    }

    const filteredChannels = channels.filter((channel) =>
        channel.name.toLowerCase().includes(searchChannel.toLowerCase())
    )

    if (loading) {
        return (
            <div className="channel-list-container">
                <div className="loading-channels">Cargando canales...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="channel-list-container">
                <div className="error-channels">Error: {error.message}</div>
            </div>
        )
    }

    return (
        <div className="channel-list-container">
            <div className="channel-list-header">
                <h3>Canales</h3>
                <button onClick={handleCreateChannel} className="create-channel-btn">
                    <IoAdd className="btn-icon" />
                </button>
            </div>

            <div className="search-bar">
                <IoSearchSharp className="search-icon" />
                <input
                    type="text"
                    placeholder="Buscar canales"
                    value={searchChannel}
                    onChange={(e) => setSearchChannel(e.target.value)}
                    className="input"
                />
            </div>

            <div className="channels-container">
                {filteredChannels.length === 0 ? (
                    <div className="no-channels">
                        <span>No hay canales en este workspace</span>
                    </div>
                ) : (
                    filteredChannels.map((channel) => (
                        <div
                            key={channel._id}
                            className={`channel-item ${currentChannelId === channel._id ? 'active' : ''}`}
                        >
                            <div 
                                className="channel-info"
                                onClick={() => handleChannelClick(channel)}
                            >
                                <span className="channel-name">
                                    {channel.private && <IoLockClosed className="lock-icon" />}
                                    #{channel.name}
                                </span>
                                {channel.description && (
                                    <span className="channel-description">{channel.description}</span>
                                )}
                            </div>
                            
                            <div className="channel-actions">
                                <button 
                                    className="channel-action-btn edit-btn"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleEditChannel(channel)
                                    }}
                                    title="Editar canal"
                                >
                                    <IoSettings />
                                </button>
                                <button 
                                    className="channel-action-btn delete-btn"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteChannel(channel)
                                    }}
                                    title="Eliminar canal"
                                >
                                    <IoTrash />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}