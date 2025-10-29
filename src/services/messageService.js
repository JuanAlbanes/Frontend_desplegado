import ENVIRONMENT from "../config/environment.js"
import { CONTENT_TYPE_VALUES, HEADERS, HTTP_METHODS } from "../constants/http.js"

export async function getMessages(channelId, token) {
    const response_http = await fetch(
        `${ENVIRONMENT.URL_API}/api/messages/${channelId}`,
        {
            method: HTTP_METHODS.GET,
            headers: {
                [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                Authorization: `Bearer ${token}`
            }
        }
    )

    const response_data = await response_http.json()

    if (!response_data.ok) {
        throw new Error(response_data.message)
    }

    return response_data
}

export async function sendMessage(channelId, messageText, token) {
    const message = {
        channel_id: channelId,
        text: messageText
    }

    const response_http = await fetch(
        `${ENVIRONMENT.URL_API}/api/messages`,
        {
            method: HTTP_METHODS.POST,
            headers: {
                [HEADERS.CONTENT_TYPE]: CONTENT_TYPE_VALUES.JSON,
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(message)
        }
    )

    const response_data = await response_http.json()

    if (!response_data.ok) {
        throw new Error(response_data.message)
    }

    return response_data
}
