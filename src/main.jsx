import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"
import WorkspaceContextProvider from "./slack/Context/WorkspaceContext.jsx"
import MessagesContextProvider from "./slack/Context/MessagesContext.jsx"
import UserContextProvider from "./slack/Context/UserContext.jsx"
import { BrowserRouter } from "react-router"

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserContextProvider>
        <WorkspaceContextProvider>
          <MessagesContextProvider>
            <App />
          </MessagesContextProvider>
        </WorkspaceContextProvider>
      </UserContextProvider>
    </BrowserRouter>
  </React.StrictMode>
)