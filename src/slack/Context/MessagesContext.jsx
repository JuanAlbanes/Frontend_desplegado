import { createContext, useState, useRef } from "react"
import {
    getMessagesByWorkspaceId,
    addMessageToWorkspace,
    deleteMessageFromWorkspace,
    updateMessageInWorkspace
} from "../services/messagesService-slack.js"
import { getMessagesByChannel } from "../../services/messageService.js"

export const MessagesContext = createContext({
    messages: [],
    isMessagesLoading: true,
    currentWorkspaceId: null,
    currentChannelId: null,
    loadMessages: (workspace_id, channel_id) => {},
    handleAddMessage: (workspace_id, channel_id, text) => {},
    handleDeleteMessage: (workspace_id, message_id) => {},
    handleUpdateMessage: (workspace_id, message_id, newText) => {},
})

const MessagesContextProvider = ({ children }) => {
    const [messages, setMessages] = useState([])
    const [isMessagesLoading, setIsMessagesLoading] = useState(true)
    const [currentWorkspaceId, setCurrentWorkspaceId] = useState(null)
    const [currentChannelId, setCurrentChannelId] = useState(null)

    const lastMessageRef = useRef(null)

    const loadMessages = async (workspace_id, channel_id) => {
        setIsMessagesLoading(true)
        setCurrentWorkspaceId(workspace_id)
        setCurrentChannelId(channel_id)
        
        try {
            const workspaceMessages = await getMessagesByWorkspaceId(workspace_id, channel_id)
            
            // CORREGIDO: Normalizar los IDs para que todos los mensajes tengan tanto _id como id
            const normalizedMessages = workspaceMessages.map(message => ({
                ...message,
                id: message.id || message._id, // Asegurar que siempre haya un campo `id`
                _id: message._id || message.id  // Asegurar que siempre haya un campo `_id`
            }))
            
            setMessages(normalizedMessages)
        } catch (error) {
            console.error('Error loading messages:', error)
            setMessages([])
        } finally {
            setIsMessagesLoading(false)
        }
    }

    const handleAddMessage = async (workspace_id, channel_id, text) => {
        const last = lastMessageRef.current
        if (last && last.workspace_id === workspace_id && last.channel_id === channel_id && last.text === text) return

        try {
            const newMessage = await addMessageToWorkspace(workspace_id, channel_id, text)
            if (newMessage) {
                setMessages((prev) => [...prev, newMessage])
                lastMessageRef.current = { workspace_id, channel_id, text }
            }
        } catch (error) {
            console.error('Error adding message:', error)
            throw error
        }
    }

    const handleDeleteMessage = async (workspace_id, message_id) => {
        try {
            const success = await deleteMessageFromWorkspace(workspace_id, message_id)
            if (success) {
                setMessages((prev) => prev.filter((m) => 
                    // CORREGIDO: Buscar por ambos campos _id e id
                    (m._id !== message_id && m.id !== message_id)
                ))
            }
        } catch (error) {
            console.error('Error deleting message:', error)
            throw error
        }
    }

    const handleUpdateMessage = async (workspace_id, message_id, newText) => {
        try {
            const updatedMessage = await updateMessageInWorkspace(workspace_id, message_id, newText)
            if (updatedMessage) {
                setMessages((prev) => 
                    prev.map((m) => 
                        // CORREGIDO: Buscar por ambos campos _id e id
                        ((m._id === message_id || m.id === message_id) ? updatedMessage : m)
                    )
                )
            }
        } catch (error) {
            console.error('Error updating message:', error)
            throw error
        }
    }

    return (
        <MessagesContext.Provider
            value={{
                messages,
                isMessagesLoading,
                loadMessages,
                handleAddMessage,
                handleDeleteMessage,
                handleUpdateMessage,
                currentWorkspaceId,
                currentChannelId,
            }}
        >
            {children}
        </MessagesContext.Provider>
    )
}

export default MessagesContextProvider