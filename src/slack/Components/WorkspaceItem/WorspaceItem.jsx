import { useContext } from "react"
import { Link } from "react-router"
import { WorkspaceContext } from "../../Context/WorkspaceContext"
import "./WorkspaceItem.css"
import { MdDelete } from "react-icons/md"
import { IoChatbubbleEllipses } from "react-icons/io5"
import Swal from "sweetalert2"

export default function WorkspaceItem({ 
    id, 
    name, 
    description, 
    created_at, 
    messageCount, 
    isActive,     
    onClick          
}) {
    const { handleDeleteWorkspace } = useContext(WorkspaceContext)

    const handleDelete = (e) => {
        e.preventDefault()
        e.stopPropagation() 
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#611f69",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            background: "#ffffff",
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteWorkspace(id)
                Swal.fire({
                    title: "Eliminado!",
                    text: "El espacio de trabajo ha sido eliminado",
                    icon: "success",
                    confirmButtonColor: "#611f69",
                    timer: 1500,
                })
            }
        })
    }

    const handleItemClick = (e) => {
        if (onClick) {
            onClick(); 
        }
    }

    return (
        <Link to={`/workspace/${id}`} className="workspace-item-link">
            <div 
                className={`workspace-detail-item ${isActive ? 'active' : ''}`}
                onClick={handleItemClick}
            >
                <div className="workspace-detail-icon">
                    <IoChatbubbleEllipses />
                </div>
                <div className="workspace-detail-info">
                    <h3 className="workspace-detail-name">{name}</h3>
                    <p className="workspace-detail-description">{description}</p>
                    <div className="workspace-detail-meta">
                        <span className="workspace-detail-time">{created_at}</span>
                        <span className="workspace-detail-messages">{messageCount} mensajes</span>
                    </div>
                </div>
                <button onClick={handleDelete} className="workspace-detail-delete-btn">
                    <MdDelete />
                </button>
            </div>
        </Link>
    )
}