export interface Chat {
  id: string
  chatId: string
  phone: string
  name: string
  lastMessage: string
  lastMessageTime: string
  messages: Message[]
}

export interface Message {
  id: string
  text: string
  timestamp: string
  fromMe: boolean
}