import { useContext, useEffect } from "react"
import { useParams, useNavigate } from "react-router"
import { MessagesContext } from "../../Context/MessagesContext"
import { WorkspaceContext } from "../../Context/WorkspaceContext"
import ChatHeader from "../../Components/ChatHeader/ChatHeader"
import Chat from "../../Components/Chat/Chat"
import NewMessageForm from "../../Components/NewMessageForm/NewMessageForm"
import WorkspaceList from "../../Components/WorkspaceList/WorkspaceList"
import LoaderSpinner from "../../Components/LoaderSpinner/LoaderSpinner"
import SlackLayout from "../../Components/Layout/SlackLayout"
import "./ChatScreen.css"

export default function ChatScreen() {
    const { workspace_id } = useParams()
    const { loadMessages, isMessagesLoading } = useContext(MessagesContext)
    const { workspaces } = useContext(WorkspaceContext)
    const navigate = useNavigate()

    const currentWorkspace = workspaces.find((w) => w.id === Number(workspace_id))

    const handleWorkspaceSelect = (workspace) => {
        navigate(`/workspace/${workspace.id}`)
    }

    useEffect(() => {
        loadMessages(workspace_id)
    }, [workspace_id])

    const sidebarContent = (
        <div className="chat-sidebar">
            <div className="sidebar-header">
                <h3>Workspaces</h3>
            </div>
            <div className="sidebar-workspace-list">
                <WorkspaceList 
                    currentWorkspaceId={Number(workspace_id)} 
                    onWorkspaceSelect={handleWorkspaceSelect} 
                />
            </div>
        </div>
    )

    if (isMessagesLoading) {
        return <LoaderSpinner />
    }

    return (
        <SlackLayout sidebarContent={sidebarContent}>
            <div className="chat-screen">
                <ChatHeader workspace={currentWorkspace} />
                <Chat />
                <NewMessageForm />
            </div>
        </SlackLayout>
    )
}