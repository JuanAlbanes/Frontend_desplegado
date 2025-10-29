import { createContext, useState } from "react"
import { getWorkspaceList, addWorkspace, deleteWorkspace } from "../services/workspaceService"

export const WorkspaceContext = createContext({
    workspaces: [],
    isLoadingWorkspaces: true,
    handleAddWorkspace: (name, description) => { },
    handleDeleteWorkspace: (workspace_id) => { },
})

const WorkspaceContextProvider = ({ children }) => {
    const [workspaces, setWorkspaces] = useState([])
    const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(true)

    setTimeout(() => {
        const workspace_list = getWorkspaceList()
        setWorkspaces(workspace_list)
        setIsLoadingWorkspaces(false)
    }, 900)

    const handleAddWorkspace = (name, description) => {
        const newWorkspace = addWorkspace(name, description)
        setWorkspaces([...workspaces, newWorkspace])
    }

    const handleDeleteWorkspace = (workspace_id) => {
        const success = deleteWorkspace(workspace_id)
        if (success) {
            const updatedWorkspaces = workspaces.filter((w) => w.id !== Number(workspace_id))
            setWorkspaces(updatedWorkspaces)
        }
    }

    return (
        <WorkspaceContext.Provider
            value={{
                workspaces,
                isLoadingWorkspaces,
                handleAddWorkspace,
                handleDeleteWorkspace,
            }}
        >
            {children}
        </WorkspaceContext.Provider>
    )
}

export default WorkspaceContextProvider