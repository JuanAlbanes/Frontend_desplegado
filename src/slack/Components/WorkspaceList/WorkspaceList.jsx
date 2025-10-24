import { useContext, useState } from "react"
import { WorkspaceContext } from "../../Context/WorkspaceContext"
import WorkspaceItem from '../WorkspaceItem/WorspaceItem.jsx'
import "./WorkspaceList.css"
import { IoAdd } from "react-icons/io5"
import { IoSearchSharp } from "react-icons/io5"
import Swal from "sweetalert2"

export default function WorkspaceList({ currentWorkspaceId, onWorkspaceSelect }) {
    const { workspaces, handleAddWorkspace } = useContext(WorkspaceContext)
    const [searchWorkspace, setSearchWorkspace] = useState("")

    const filteredWorkspaces = workspaces.filter((workspace) =>
        workspace.name.toLowerCase().includes(searchWorkspace.toLowerCase()),
    )

    const handleCreateWorkspace = () => {
        Swal.fire({
            title: "Crear nuevo espacio de trabajo",
            html: `
        <input id="workspace-name" class="swal2-input" placeholder="Nombre del espacio">
        <input id="workspace-description" class="swal2-input" placeholder="Descripción">
        `,
            confirmButtonText: "Crear",
            confirmButtonColor: "#611f69",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            background: "#ffffff",
            preConfirm: () => {
                const name = document.getElementById("workspace-name").value
                const description = document.getElementById("workspace-description").value
                if (!name) {
                    Swal.showValidationMessage("El nombre es requerido")
                }
                return { name, description }
            },
        }).then((result) => {
            if (result.isConfirmed) {
                handleAddWorkspace(result.value.name, result.value.description)
                Swal.fire({
                    title: "Espacio creado!",
                    icon: "success",
                    confirmButtonColor: "#611f69",
                    timer: 1500,
                })
            }
        })
    }

    const handleWorkspaceClick = (workspace) => {
        if (onWorkspaceSelect) {
            onWorkspaceSelect(workspace);
        }
    }

    return (
        <div className="workspace-list-container">

            <div className="search-bar">
                <IoSearchSharp className="search-icon" />
                <input
                    type="text"
                    placeholder="Buscar espacios de trabajo"
                    value={searchWorkspace}
                    onChange={(e) => setSearchWorkspace(e.target.value)}
                    className="input"
                />
            </div>

            <div className="workspaces-container">
                {filteredWorkspaces.length === 0 ? (
                    <div className="no-workspaces">
                        <span>No hay espacios de trabajo</span>
                    </div>
                ) : (
                    filteredWorkspaces.map((workspace) => (
                        <WorkspaceItem
                            key={workspace.id}
                            id={workspace.id}
                            name={workspace.name}
                            description={workspace.description}
                            created_at={workspace.created_at}
                            messageCount={workspace.messages.length}
                            isActive={currentWorkspaceId === workspace.id}
                            onClick={() => handleWorkspaceClick(workspace)}
                        />
                    ))
                )}
            </div>
            <div className="sidebar-footer">
                <button onClick={handleCreateWorkspace} className="create-workspace-sidebar-btn">
                    <IoAdd className="btn-icon" />
                    <span>Crear workspace</span>
                </button>
            </div>
        </div>
    )
}