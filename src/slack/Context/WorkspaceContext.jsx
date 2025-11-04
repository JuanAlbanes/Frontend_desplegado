import { createContext, useState, useEffect, useCallback } from "react"
import { getWorkspaceList, createWorkspace, deleteWorkspace } from "../services/workspaceService"

export const WorkspaceContext = createContext({
    workspaces: [],
    isLoadingWorkspaces: true,
    loadWorkspaces: async () => {},
    handleAddWorkspace: async (name, description) => { },
    handleDeleteWorkspace: async (workspace_id) => { },
    handleSetWorkspaces: (workspaces) => { },
})

const WorkspaceContextProvider = ({ children }) => {
    const [workspaces, setWorkspaces] = useState([])
    const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(true)

    // ✅ CORREGIDO: Usar useCallback para evitar recreación en cada render
    const loadWorkspaces = useCallback(async () => {
        try {
            setIsLoadingWorkspaces(true)
            const response = await getWorkspaceList()
            
            // Manejar diferentes estructuras de respuesta
            if (response && response.data && response.data.workspaces) {
                setWorkspaces(response.data.workspaces)
            } else if (response && response.workspaces) {
                setWorkspaces(response.workspaces)
            } else {
                console.warn('Estructura de respuesta inesperada:', response)
                setWorkspaces([])
            }
        } catch (error) {
            console.error('Error loading workspaces:', error)
            setWorkspaces([])
        } finally {
            setIsLoadingWorkspaces(false)
        }
    }, [])

    // Cargar workspaces al montar el contexto
    useEffect(() => {
        loadWorkspaces()
    }, [loadWorkspaces]) // ✅ Ahora loadWorkspaces es estable

    const handleAddWorkspace = async (name, url_image = "") => {
        try {
            const response = await createWorkspace(name, url_image)
            
            if (response && response.ok) {
                await loadWorkspaces()
                return true
            } else {
                console.error('Error en la respuesta del servidor:', response)
                return false
            }
        } catch (error) {
            console.error('Error creating workspace:', error)
            throw error
        }
    }

    const handleDeleteWorkspace = async (workspace_id) => {
        try {
            const response = await deleteWorkspace(workspace_id)
            if (response && response.ok) {
                const updatedWorkspaces = workspaces.filter((w) => w._id !== workspace_id)
                setWorkspaces(updatedWorkspaces)
                return true
            }
            return false
        } catch (error) {
            console.error('Error deleting workspace:', error)
            throw error
        }
    }

    const handleSetWorkspaces = (newWorkspaces) => {
        setWorkspaces(newWorkspaces)
    }

    return (
        <WorkspaceContext.Provider
            value={{
                workspaces,
                isLoadingWorkspaces,
                loadWorkspaces,
                handleAddWorkspace,
                handleDeleteWorkspace,
                handleSetWorkspaces,
            }}
        >
            {children}
        </WorkspaceContext.Provider>
    )
}

export default WorkspaceContextProvider