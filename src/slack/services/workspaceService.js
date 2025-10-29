import mock_data from "../data/workspace-mock"

export const getWorkspaceList = () => {
    return mock_data.workspaces
}

export const getWorkspaceById = (workspace_id) => {
    for (const workspace of mock_data.workspaces) {
        if (Number(workspace.id) === Number(workspace_id)) {
            return workspace
        }
    }
    return null
}

export const addWorkspace = (name, description) => {
    const newWorkspace = {
        id: mock_data.workspaces.length + 1,
        name: name,
        description: description,
        created_at: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
        messages: [],
    }
    mock_data.workspaces.push(newWorkspace)
    return newWorkspace
}

export const deleteWorkspace = (workspace_id) => {
    const index = mock_data.workspaces.findIndex((w) => w.id === Number(workspace_id))
    if (index !== -1) {
        mock_data.workspaces.splice(index, 1)
        return true
    }
    return false
}