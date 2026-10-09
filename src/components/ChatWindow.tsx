import {
  Avatar,
  Box,
  IconButton,
  Typography,
  useMediaQuery,
} from '@mui/material'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SearchIcon from '@mui/icons-material/Search'

import MessageInput from './MessageInput'

import type { Chat, Message } from '../types/chat'
import type { GreenApiConfig } from '../services/greenApi'

interface ChatWindowProps {
  chat: Chat | null
  config: GreenApiConfig
  onMessageSent: (message: Message) => void
  onBackToChats: () => void
}

function ChatWindow({
  chat,
  config,
  onMessageSent,
  onBackToChats,
}: ChatWindowProps) {
  const isMobile = useMediaQuery('(max-width:719px)')

  if (!chat) {
    return (
      <Box
        sx={{
          flex: 1,
          width: '100%',
          minWidth: 0,
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#efeae2',
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            maxWidth: 420,
            px: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 400,
              color: '#41525d',
              mb: 1,
            }}
          >
            WhatsApp Web
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            Выберите чат, чтобы начать общение
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        flex: 1,
        width: '100%',
        minWidth: 0,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#efeae2',
      }}
    >
      <Box
        sx={{
          height: 64,
          minHeight: 64,
          px: { xs: 1, sm: 2 },
          display: 'flex',
          alignItems: 'center',
          bgcolor: '#f0f2f5',
          borderBottom: '1px solid #d1d7db',
        }}
      >
        <IconButton
          onClick={onBackToChats}
          aria-label="Вернуться к чатам"
          sx={{
            display: isMobile ? 'flex' : 'none',
            mr: 1,
            color: '#54656f',
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Avatar
          sx={{
            width: 42,
            height: 42,
            mr: 1.5,
            bgcolor: '#dfe5e7',
            color: '#54656f',
          }}
        >
          {chat.name
            .charAt(0)
            .toUpperCase()}
        </Avatar>

        <Box
          sx={{
            minWidth: 0,
            flex: 1,
          }}
        >
          <Typography
            noWrap
            sx={{
              fontSize: 16,
              fontWeight: 500,
              color: '#111b21',
            }}
          >
            {chat.name}
          </Typography>

          <Typography
            noWrap
            sx={{
              fontSize: 13,
              color: '#667781',
            }}
          >
            WhatsApp
          </Typography>
        </Box>

        <IconButton
          sx={{
            display: { xs: 'none', sm: 'inline-flex' },
            color: '#54656f',
          }}
        >
          <SearchIcon />
        </IconButton>

        <IconButton
          sx={{
            color: '#54656f',
          }}
        >
          <MoreVertIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          p: {
            xs: 1.5,
            md: 3,
          },
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 0.75,
          bgcolor: '#efeae2',
          backgroundImage: `
            radial-gradient(
              rgba(84, 101, 111, 0.08) 1px,
              transparent 1px
            )
          `,
          backgroundSize: '24px 24px',
        }}
      >
        {chat.messages.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 2,
                bgcolor: 'rgba(255,255,255,0.75)',
                textAlign: 'center',
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  color: '#667781',
                }}
              >
                Сообщений пока нет
              </Typography>
            </Box>
          </Box>
        ) : (
          chat.messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                alignSelf: message.fromMe
                  ? 'flex-end'
                  : 'flex-start',
                maxWidth: {
                  xs: '85%',
                  md: '70%',
                },
                minWidth: 0,
                px: 1.5,
                py: 1,
                borderRadius: message.fromMe
                  ? '8px 0 8px 8px'
                  : '0 8px 8px 8px',
                bgcolor: message.fromMe
                  ? '#d9fdd3'
                  : '#fff',
                boxShadow:
                  '0 1px 1px rgba(0,0,0,0.08)',
                overflowWrap: 'anywhere',
                wordBreak: 'break-word',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 1.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 14.5,
                    lineHeight: 1.45,
                    color: '#111b21',
                    overflowWrap: 'anywhere',
                    wordBreak: 'break-word',
                  }}
                >
                  {message.text}
                </Typography>

                <Typography
                  sx={{
                    flexShrink: 0,
                    fontSize: 11,
                    color: '#667781',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {new Date(
                    message.timestamp,
                  ).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </Box>

      <MessageInput
        config={config}
        chatId={chat.chatId}
        onMessageSent={onMessageSent}
      />
    </Box>
  )
}

export default ChatWindow