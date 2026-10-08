import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { Chat, Message } from '../types/chat'

interface ChatStore {
  chats: Chat[]
  activeChatId: string | null

  createChat: (
    phone: string,
    chatId: string,
  ) => void

  deleteChat: (
    chatId: string,
  ) => void

  setActiveChat: (
    chatId: string | null,
  ) => void

  addMessage: (
    chatId: string,
    message: Message,
  ) => void

  setChats: (
    chats: Chat[],
  ) => void

  setMessages: (
    chatId: string,
    messages: Message[],
  ) => void
}

function normalizeChatId(chatId: string) {
  return chatId
    .replace('@c.us', '')
    .replace('@g.us', '')
    .replace(/\D/g, '')
}

export const useChatStore =
  create<ChatStore>()(
    persist(
      (set) => ({
        chats: [],
        activeChatId: null,

        setChats: (chats) => {
          set({
            chats,
          })
        },

        setMessages: (
          chatId,
          messages,
        ) => {
          const normalizedChatId =
            normalizeChatId(
              chatId,
            )

          set((state) => ({
            chats: state.chats.map(
              (chat) => {
                const isSameChat =
                  normalizeChatId(
                    chat.chatId,
                  ) ===
                  normalizedChatId

                if (!isSameChat) {
                  return chat
                }

                const lastMessage =
                  messages[
                    messages.length - 1
                  ]

                return {
                  ...chat,
                  messages,
                  lastMessage:
                    lastMessage?.text ??
                    '',
                  lastMessageTime:
                    lastMessage
                      ? new Date(
                          lastMessage.timestamp,
                        ).toLocaleTimeString(
                          [],
                          {
                            hour: '2-digit',
                            minute:
                              '2-digit',
                          },
                        )
                      : '',
                }
              },
            ),
          }))
        },

        createChat: (
          phone,
          chatId,
        ) => {
          set((state) => {
            const normalizedChatId =
              normalizeChatId(
                chatId,
              )

            const exists =
              state.chats.some(
                (chat) =>
                  normalizeChatId(
                    chat.chatId,
                  ) ===
                  normalizedChatId,
              )

            if (exists) {
              const existingChat =
                state.chats.find(
                  (chat) =>
                    normalizeChatId(
                      chat.chatId,
                    ) ===
                    normalizedChatId,
                )

              return {
                activeChatId:
                  existingChat?.chatId ??
                  chatId,
              }
            }

            const newChat: Chat = {
              id: chatId,
              chatId,
              phone,
              name: phone,
              lastMessage: '',
              lastMessageTime: '',
              messages: [],
            }

            return {
              chats: [
                ...state.chats,
                newChat,
              ],
              activeChatId:
                chatId,
            }
          })
        },

        deleteChat: (
          chatId,
        ) => {
          const normalizedChatId =
            normalizeChatId(
              chatId,
            )

          set((state) => ({
            chats:
              state.chats.filter(
                (chat) =>
                  normalizeChatId(
                    chat.chatId,
                  ) !==
                  normalizedChatId,
              ),

            activeChatId:
              normalizeChatId(
                state.activeChatId ??
                  '',
              ) ===
              normalizedChatId
                ? null
                : state.activeChatId,
          }))
        },

        setActiveChat: (
          chatId,
        ) => {
          set({
            activeChatId:
              chatId,
          })
        },

        addMessage: (
          chatId,
          message,
        ) => {
          const normalizedChatId =
            normalizeChatId(
              chatId,
            )

          set((state) => ({
            chats:
              state.chats.map(
                (chat) => {
                  const isSameChat =
                    normalizeChatId(
                      chat.chatId,
                    ) ===
                    normalizedChatId

                  if (!isSameChat) {
                    return chat
                  }

                  const alreadyExists =
                    chat.messages.some(
                      (
                        existingMessage,
                      ) =>
                        existingMessage.id ===
                        message.id,
                    )

                  if (alreadyExists) {
                    return chat
                  }

                  return {
                    ...chat,

                    messages: [
                      ...chat.messages,
                      message,
                    ],

                    lastMessage:
                      message.text,

                    lastMessageTime:
                      new Date(
                        message.timestamp,
                      ).toLocaleTimeString(
                        [],
                        {
                          hour: '2-digit',
                          minute:
                            '2-digit',
                        },
                      ),
                  }
                },
              ),
          }))
        },
      }),
      {
        name: 'green-chat-storage',
      },
    ),
  )