import { useEffect } from 'react'

import {
  deleteNotification,
  receiveNotification,
} from '../services/greenApi'

import { useChatStore } from '../store/chatStore'

import type { GreenApiConfig } from '../services/greenApi'
import type { Message } from '../types/chat'

interface UseMessagesProps {
  config: GreenApiConfig
}

function normalizeChatId(chatId: string) {
  return chatId
    .replace('@c.us', '')
    .replace('@g.us', '')
    .replace(/\D/g, '')
}

function useMessages({
  config,
}: UseMessagesProps) {
  useEffect(() => {
    let stopped = false

    const receiveLoop = async () => {
      while (!stopped) {
        try {
          const notification =
            await receiveNotification(config)

          if (!notification) {
            continue
          }

          const {
            body,
            receiptId,
          } = notification

          const isIncomingMessage =
            body.typeWebhook ===
            'incomingMessageReceived'

          const isOutgoingMessage =
            body.typeWebhook ===
              'outgoingMessageReceived' ||
            body.typeWebhook ===
              'outgoingAPIMessageReceived'

          const isTextMessage =
            body.messageData?.typeMessage ===
            'textMessage'

          if (
            !isIncomingMessage &&
            !isOutgoingMessage
          ) {
            await deleteNotification(
              config,
              receiptId,
            )

            continue
          }

          if (!isTextMessage) {
            await deleteNotification(
              config,
              receiptId,
            )

            continue
          }

          const text =
            body.messageData
              ?.textMessageData
              ?.textMessage

          const notificationChatId =
            body.senderData?.chatId

          if (
            !text ||
            !notificationChatId
          ) {
            await deleteNotification(
              config,
              receiptId,
            )

            continue
          }

          const store =
            useChatStore.getState()

          const normalizedNotificationChatId =
            normalizeChatId(
              notificationChatId,
            )

          let targetChat =
            store.chats.find(
              (chat) =>
                normalizeChatId(
                  chat.chatId,
                ) ===
                normalizedNotificationChatId,
            )

          if (!targetChat) {
            const previousActiveChatId =
              useChatStore.getState()
                .activeChatId

            store.createChat(
              notificationChatId
                .replace('@c.us', '')
                .replace('@g.us', ''),
              notificationChatId,
            )

            if (
              previousActiveChatId &&
              previousActiveChatId !==
                notificationChatId
            ) {
              useChatStore
                .getState()
                .setActiveChat(
                  previousActiveChatId,
                )
            }

            targetChat =
              useChatStore
                .getState()
                .chats.find(
                  (chat) =>
                    normalizeChatId(
                      chat.chatId,
                    ) ===
                    normalizedNotificationChatId,
                )
          }

          if (!targetChat) {
            console.error(
              'Не удалось определить чат для notification:',
              notification,
            )

            await deleteNotification(
              config,
              receiptId,
            )

            continue
          }

          const message: Message = {
            id: body.idMessage,
            text,
            timestamp: new Date(
              body.timestamp * 1000,
            ).toISOString(),
            fromMe:
              isOutgoingMessage,
          }

          useChatStore
            .getState()
            .addMessage(
              targetChat.chatId,
              message,
            )

          await deleteNotification(
            config,
            receiptId,
          )
        } catch (error) {
          if (!stopped) {
            console.error(
              'Ошибка получения сообщения:',
              error,
            )

            await new Promise(
              (resolve) =>
                setTimeout(
                  resolve,
                  1000,
                ),
            )
          }
        }
      }
    }

    void receiveLoop()

    return () => {
      stopped = true
    }
  }, [config])
}

export default useMessages