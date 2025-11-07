import { getMessagesByChannel, sendMessage, updateMessage, deleteMessage } from "../../services/messageService.js"

export const getMessagesByWorkspaceId = async (workspace_id, channel_id) => {
    try {
        const response = await getMessagesByChannel(workspace_id, channel_id)
        
        if (response && response.data && Array.isArray(response.data.messages)) {
            return response.data.messages || []
        } else {
            console.warn('⚠️ Invalid response structure in getMessagesByWorkspaceId:', response)
            return []
        }
    } catch (error) {
        console.error('Error getting messages:', error)
        return []
    }
}

export const addMessageToWorkspace = async (workspace_id, channel_id, text) => {
    try {
        const response = await sendMessage(channel_id, text)
        
        if (response && response.data && response.data.message) {
            const newMessage = {
                id: response.data.message._id,
                _id: response.data.message._id, 
                emisor: response.data.message.user?.name || "Usuario",
                hora: new Date(response.data.message.created_at).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                texto: response.data.message.content,
                status: "enviado",
                isMyMessage: true,
                created_at: response.data.message.created_at,
                user_id: response.data.message.user?._id 
            }
            
            return newMessage
        } else {
            throw new Error('Invalid response structure from sendMessage')
        }
    } catch (error) {
        console.error('Error sending message:', error)
        throw error
    }
}

export const deleteMessageFromWorkspace = async (workspace_id, message_id) => {
    try {
        const response = await deleteMessage(message_id)
        
        if (response && response.ok) {
            return true
        } else {
            throw new Error(response?.message || 'Error deleting message')
        }
    } catch (error) {
        console.error('Error deleting message:', error)
        throw error
    }
}

export const updateMessageInWorkspace = async (workspace_id, message_id, newText) => {
    try {
        const response = await updateMessage(message_id, newText)
        
        if (response && response.data && response.data.message) {
            const updatedMessage = {
                id: response.data.message._id,
                _id: response.data.message._id,
                emisor: response.data.message.user?.name || "Usuario",
                hora: new Date(response.data.message.created_at).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                texto: response.data.message.content,
                status: "editado",
                isMyMessage: true,
                created_at: response.data.message.created_at,
                user_id: response.data.message.user?._id 
            }
            
            return updatedMessage
        } else {
            throw new Error('Invalid response structure from updateMessage')
        }
    } catch (error) {
        console.error('Error updating message:', error)
        throw error
    }
}