import { useContext } from "react"
import { MessagesContext } from "../../Context/MessagesContext"
import Message from "../Message/Message"
import "./Chat.css"

export default function Chat() {
    const { messages } = useContext(MessagesContext)

    if (messages.length === 0) {
        return (
            <div className="container-no-messages">
                <span>No hay mensajes aún. ¡Envía el primero!</span>
            </div>
        )
    }

    return (
        <div className="container-messages">
            {messages.map((message) => (
                <Message
                    key={message.id}
                    id={message.id}
                    emisor={message.emisor}
                    hora={message.hora}
                    texto={message.texto}
                    status={message.status}
                    isMyMessage={message.isMyMessage}
                />
            ))}
        </div>
    )
}