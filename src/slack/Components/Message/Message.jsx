import { useContext } from "react"
import { useParams } from "react-router"
import { MessagesContext } from "../../Context/MessagesContext"
import "./Message.css"
import { MdDelete } from "react-icons/md"
import { IoCheckmarkDone } from "react-icons/io5"

export default function Message({ id, emisor, hora, texto, status, isMyMessage }) {
    const { workspace_id } = useParams()
    const { handleDeleteMessage } = useContext(MessagesContext)

    const messageClass = isMyMessage ? "message message-my-message" : "message message-other"

    const handleDelete = () => {
        handleDeleteMessage(workspace_id, id)
    }

    return (
        <div className={messageClass}>
            <div className="message-content">
                {!isMyMessage && <div className="message-sender">{emisor}</div>}
                <div className="message-text">{texto}</div>
                <div className="message-footer">
                    <span className="message-time">{hora}</span>
                    {isMyMessage && <IoCheckmarkDone className={`message-status ${status === "visto" ? "status-seen" : ""}`} />}
                </div>
            </div>
            <button onClick={handleDelete} className="btn-delete-message">
                <MdDelete />
            </button>
        </div>
    )
}