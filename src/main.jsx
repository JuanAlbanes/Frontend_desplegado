import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"
import WorkspaceContextProvider from "./slack/Context/WorkspaceContext.jsx"
import MessagesContextProvider from "./slack/Context/MessagesContext.jsx"
import { BrowserRouter } from "react-router"

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <WorkspaceContextProvider>
        <MessagesContextProvider>
          <App />
        </MessagesContextProvider>
      </WorkspaceContextProvider>
    </BrowserRouter>
  </React.StrictMode>
)