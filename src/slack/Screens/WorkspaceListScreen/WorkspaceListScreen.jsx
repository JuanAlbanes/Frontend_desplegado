import { useContext } from "react"
import { useNavigate } from "react-router"
import { WorkspaceContext } from "../../Context/WorkspaceContext"
import WorkspaceList from "../../Components/WorkspaceList/WorkspaceList"
import LoaderSpinner from "../../Components/LoaderSpinner/LoaderSpinner"
import SlackLayout from "../../Components/Layout/SlackLayout"
import "./WorkspaceListScreen.css"

export default function WorkspaceListScreen() {
    const { isLoadingWorkspaces, workspaces } = useContext(WorkspaceContext)
    const navigate = useNavigate()

    const handleWorkspaceSelect = (workspace) => {
        navigate(`/workspace/${workspace.id}`)
    }

    const sidebarContent = (
        <div className="workspace-sidebar">
            <div className="sidebar-header">
                <h3>Tus Workspaces</h3>
            </div>
            <div className="sidebar-workspace-list">
                <WorkspaceList onWorkspaceSelect={handleWorkspaceSelect} />
            </div>
        </div>
    )

    if (isLoadingWorkspaces) {
        return <LoaderSpinner />
    }

    return (
        <SlackLayout sidebarContent={sidebarContent}>
            <div className="workspace-welcome">
                <h1>Selecciona un workspace para comenzar</h1>
                <p>Elige uno de la sidebar o crea uno nuevo</p>
            </div>
        </SlackLayout>
    )
}