import { useEffect, useRef, useState } from 'react'
import {
  Box,
  IconButton,
  useMediaQuery,
} from '@mui/material'

import ChevronRightIcon from '@mui/icons-material/ChevronRight'

import Header from '../components/Header'
import ChatList from '../components/ChatList'
import ChatWindow from '../components/ChatWindow'
import NewChatDialog from '../components/NewChatDialog'

import useMessages from '../hooks/useMessages'

import {
  getChats,
  getChatHistory,
} from '../services/greenApi'

import { useChatStore } from '../store/chatStore'

import type { Message } from '../types/chat'
import type { GreenApiConfig } from '../services/greenApi'

interface ChatPageProps {
  config: GreenApiConfig
}

function ChatPage({ config }: ChatPageProps) {
  const [newChatOpen, setNewChatOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileChatView, setMobileChatView] = useState(false)
  const isMobile = useMediaQuery('(max-width:719px)')

  const chats = useChatStore((state) => state.chats)
  const activeChatId = useChatStore((state) => state.activeChatId)
  const createChat = useChatStore((state) => state.createChat)
  const deleteChat = useChatStore((state) => state.deleteChat)
  const setChats = useChatStore((state) => state.setChats)
  const setActiveChat = useChatStore((state) => state.setActiveChat)
  const addMessage = useChatStore((state) => state.addMessage)
  const setMessages = useChatStore((state) => state.setMessages)

  const loadedChatsKeyRef = useRef<string | null>(null)
  const loadedHistoryKeyRef = useRef<string | null>(null)

  useMessages({ config })

  useEffect(() => {
    const configKey = `${config.idInstance}:${config.apiTokenInstance}`

    if (loadedChatsKeyRef.current === configKey) {
      return
    }

    loadedChatsKeyRef.current = configKey

    const loadChats = async () => {
      try {
        const apiChats = await getChats(config)
        const loadedChats = apiChats.map((chat) => ({
          id: chat.id,
          chatId: chat.id,
          phone: chat.id,
          name: chat.name || chat.id,
          lastMessage: '',
          lastMessageTime: '',
          messages: [],
        }))

        setChats(loadedChats)
      } catch (error) {
        console.error('Ошибка загрузки чатов:', error)
      }
    }

    void loadChats()
  }, [config, setChats])

  useEffect(() => {
    if (!activeChatId) {
      return
    }

    const configKey = `${config.idInstance}:${config.apiTokenInstance}`
    const historyKey = `${configKey}:${activeChatId}`

    if (loadedHistoryKeyRef.current === historyKey) {
      return
    }

    loadedHistoryKeyRef.current = historyKey

    const loadHistory = async () => {
      try {
        const history = await getChatHistory(config, activeChatId, 100)
        const messages: Message[] = history
          .filter(
            (item) =>
              item.typeMessage === 'textMessage' ||
              item.typeMessage === 'extendedTextMessage',
          )
          .filter((item) => Boolean(item.textMessage))
          .map((item) => ({
            id: item.idMessage,
            text: item.textMessage ?? '',
            timestamp: new Date(item.timestamp * 1000).toISOString(),
            fromMe: item.type === 'outgoing',
          }))
          .reverse()

        setMessages(activeChatId, messages)
      } catch (error) {
        console.error('Ошибка загрузки истории чата:', error)
        loadedHistoryKeyRef.current = null
      }
    }

    void loadHistory()
  }, [activeChatId, config, setMessages])

  const activeChat = chats.find((chat) => chat.chatId === activeChatId) ?? null

  const handleSelectChat = (chat: (typeof chats)[number]) => {
    setActiveChat(chat.chatId)
    if (isMobile) {
      setMobileChatView(true)
    }
  }

  const handleCreateChat = (phone: string, chatId: string) => {
    createChat(phone, chatId)
    setNewChatOpen(false)
    if (isMobile) {
      setMobileChatView(true)
    }
  }

  const handleMessageSent = (message: Message) => {
    if (!activeChat) {
      return
    }

    addMessage(activeChat.chatId, message)
  }

  const showChatList = isMobile ? !mobileChatView : sidebarOpen
  const showChatWindow = !isMobile || mobileChatView

  return (
    <Box
      sx={{
        width: '100%',
        height: '100dvh',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: '#f3f4f6',
      }}
    >
      <Header />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          minHeight: 0,
          minWidth: 0,
          maxWidth: 1500,
          width: '100%',
          mx: 'auto',
          bgcolor: '#fff',
          overflow: 'hidden',
        }}
      >
        {showChatList && (
          <ChatList
            chats={chats}
            activeChat={activeChat}
            onSelectChat={handleSelectChat}
            onNewChat={() => setNewChatOpen(true)}
            onDeleteChat={deleteChat}
            open={true}
            onToggle={() => setSidebarOpen(false)}
          />
        )}

        {!isMobile && !sidebarOpen && (
          <Box
            sx={{
              width: 56,
              minWidth: 56,
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              pt: 1.5,
              bgcolor: '#f0f2f5',
              borderRight: '1px solid #e5e7eb',
            }}
          >
            <IconButton
              onClick={() => setSidebarOpen(true)}
              sx={{
                width: 40,
                height: 40,
                color: '#54656f',
                bgcolor: '#fff',
                boxShadow: 1,
                '&:hover': { bgcolor: '#f5f6f6' },
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
        )}

        {showChatWindow && (
          <ChatWindow
            chat={activeChat}
            config={config}
            onMessageSent={handleMessageSent}
            onBackToChats={() => setMobileChatView(false)}
          />
        )}
      </Box>

      <NewChatDialog
        open={newChatOpen}
        config={config}
        onClose={() => setNewChatOpen(false)}
        onCreate={handleCreateChat}
      />
    </Box>
  )
}

export default ChatPage
