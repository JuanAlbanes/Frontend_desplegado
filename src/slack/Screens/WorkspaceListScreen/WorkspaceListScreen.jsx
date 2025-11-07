import { useContext, useEffect } from "react"
import { useNavigate } from "react-router"
import { WorkspaceContext } from "../../Context/WorkspaceContext"
import WorkspaceList from "../../Components/WorkspaceList/WorkspaceList"
import LoaderSpinner from "../../Components/LoaderSpinner/LoaderSpinner"
import SlackLayout from "../../Components/Layout/SlackLayout"
import "./WorkspaceListScreen.css"

export default function WorkspaceListScreen() {
    const { isLoadingWorkspaces, workspaces, loadWorkspaces } = useContext(WorkspaceContext)
    const navigate = useNavigate()

    useEffect(() => {
        const initializeWorkspaces = async () => {
            try {
                await loadWorkspaces()
            } catch (error) {
                console.error('Error loading workspaces:', error)
            }
        }

        initializeWorkspaces()
    }, [loadWorkspaces])

    const handleWorkspaceSelect = (workspace) => {
        if (workspace && workspace._id) {
            navigate(`/workspace/${workspace._id}`)
        } else {
            console.error('Workspace no válido:', workspace)
        }
    }

    const sidebarContent = (
        <div className="workspace-sidebar">
            <div className="sidebar-header">
                <h3>Tus Workspaces</h3>
            </div>
            <div className="sidebar-workspace-list">
                <WorkspaceList 
                    onWorkspaceSelect={handleWorkspaceSelect} 
                    currentWorkspaceId={null} 
                />
            </div>
        </div>
    )

    if (isLoadingWorkspaces) {
        return (
            <SlackLayout sidebarContent={sidebarContent}>
                <div className="workspace-welcome">
                    <LoaderSpinner />
                    <p>Cargando workspaces...</p>
                </div>
            </SlackLayout>
        )
    }

    return (
        <SlackLayout sidebarContent={sidebarContent}>
            <div className="workspace-welcome">
                <h1>Selecciona un workspace para comenzar</h1>
                <p>Elige uno de la sidebar o crea uno nuevo</p>
                
                {workspaces && workspaces.length === 0 && (
                    <div className="no-workspaces-message">
                        <p>No tienes workspaces aún. ¡Crea uno nuevo usando el botón "+" en la sidebar!</p>
                    </div>
                )}
                
                {process.env.NODE_ENV === 'development' && (
                    <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
                        <p> {workspaces ? workspaces.length : 0} workspaces cargados</p>
                    </div>
                )}
            </div>
        </SlackLayout>
    )
}