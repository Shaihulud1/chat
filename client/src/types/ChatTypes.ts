export type Message = {
    type: "text" | "voice"
    data: string,
    from: 0 | 1
}