import { Socket, Server } from 'socket.io'
import { SearchingUserTypes, UserChat, Message, MessageSend} from './types'
import { randomString } from './../helpers/Crypto'

let searchingChatUsers: SearchingUserTypes[] = []
let userChats: UserChat[] = []

const socketHandler = (socket: Socket, io: Server) => {
    socket.on('findUserForChat', (reqData: any) => {
        if (searchingChatUsers.length > 0) {
            const roomName = randomString()
            userChats.push({
                users: [socket.id, searchingChatUsers[0].socketId],
                messages: [],
                room: roomName
            })
            socket.join(roomName)
            searchingChatUsers[0].socketData.join(roomName)
            searchingChatUsers.splice(0, 1) 
            io.to(roomName).emit('startChat')
        } else {
            searchingChatUsers.push({socketId: socket.id, socketData: socket})
        }
    })


    socket.on('requestForMessages', () => {
        loadRoomMessages(socket.id)
    })

    socket.on('sendMessage', (args: MessageSend) => {
        const foundChat = userChats.find(e => e.users.includes(socket.id))
        if (foundChat) {
            foundChat.messages.push({
                type: 'text',
                data: args.text,
                from: socket.id
            })
            loadRoomMessages(socket.id)
        }
    })

    socket.on("disconnect", () => {
        leaveQ(socket.id)
        leaveC(socket.id)
    });

    const loadRoomMessages = (socketId: string) => {
        const foundChat = userChats.find(e => e.users.includes(socketId))
        if (foundChat) {
            io.to(foundChat.room).emit('loadMessages', foundChat.messages.map(item => {      
                return {
                    type: "text",
                    from: item.from,
                    data: item.data
                }
            }))
        } else {
            socket.emit('leaveChat')
        }
    }

    const leaveQ = (socketId: string) => {
        searchingChatUsers = searchingChatUsers.filter(item => item.socketId != socketId )
    }
    const leaveC = (socketId: string) => {
        const chatIndex = userChats.findIndex(item => item.users.includes(socketId))
        if (chatIndex !== -1) {
            io.to(userChats[chatIndex].room).emit('leaveChat')
            userChats.splice(chatIndex, 1)
        }
        
    }
}



export default socketHandler