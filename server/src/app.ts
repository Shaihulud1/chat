import { Response, NextFunction } from "express"
import { Socket, Server } from 'socket.io'
import { createServer } from "http";
import socketHandler from "./socket-handler"

const express = require("express")
const http = require("http")
const port = 3000
const clientDomain = "http://localhost:8081"


const app = express()

const server = http.createServer(app).listen(port)

const io = new Server(server, {
    allowEIO3: true,
    cors: {
        origin: clientDomain,
        methods: ["GET", "POST"],
        credentials: true
    }
})


io.on("connection", (socket: Socket) => socketHandler(socket, io))