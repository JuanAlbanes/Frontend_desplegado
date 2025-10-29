import { Link } from "react-router"
import "./ChatHeader.css"
import { FaArrowLeft } from "react-icons/fa6"
import { IoChatbubbleEllipses } from "react-icons/io5"

export default function ChatHeader({ workspace }) {
    if (!workspace) return null

    return (
        <div className="chat-header">
            <Link to="/home" className="btn-back">
                <FaArrowLeft />
            </Link>
            <div className="workspace-header-icon">
                <IoChatbubbleEllipses />
            </div>
            <div className="workspace-header-info">
                <h2 className="workspace-header-name">{workspace.name}</h2>
                <p className="workspace-header-description">{workspace.description}</p>
            </div>
        </div>
    )
}