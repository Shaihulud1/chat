import { Socket } from 'socket.io'

export type SearchingUserTypes = {
    socketId: string,
    socketData: Socket
}

export type Message = {
    type: "text" | "voice"
    data: string,
    from: string
}

export type UserChat = {
    users: [string, string],
    messages: Message[]
    room: string
}

export type MessageSend = {
    text: string
}