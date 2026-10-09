import {
  Box,
  IconButton,
  InputBase,
  Typography,
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DeleteIcon from '@mui/icons-material/Delete'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

import type { Chat } from '../types/chat'

interface ChatListProps {
  chats: Chat[]
  activeChat: Chat | null
  onSelectChat: (chat: Chat) => void
  onNewChat: () => void
  onDeleteChat: (chatId: string) => void
  open: boolean
  onToggle: () => void
}

function ChatList({
  chats,
  activeChat,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  open,
  onToggle,
}: ChatListProps) {

  return (
    <Box
      sx={{
        width: open ? 'min(320px, 42vw)' : 0,
        minWidth: open ? 'min(260px, 38vw)' : 0,
        maxWidth: 320,
        '@media (max-width:719px)': {
          width: open ? '100%' : 0,
          minWidth: open ? '100%' : 0,
          maxWidth: '100%',
        },
        flexShrink: 0,
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#fff',
        borderRight: open
          ? '1px solid #d1d7db'
          : 'none',
        transition: 'all 0.25s ease',
      }}
    >
      {/* Sidebar header */}

      <Box
        sx={{
          height: 64,
          minHeight: 64,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: '#f0f2f5',
        }}
      >
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 600,
            color: '#111b21',
          }}
        >
          Чаты
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <IconButton
            onClick={onToggle}
            sx={{
              display: { xs: 'none', md: 'inline-flex' },
              color: '#54656f',
            }}
          >
            <ChevronLeftIcon />
          </IconButton>

          <IconButton
            onClick={onNewChat}
            sx={{
              color: '#54656f',
            }}
          >
            <AddCommentOutlinedIcon />
          </IconButton>

          <IconButton
            sx={{
              color: '#54656f',
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Search */}

      <Box
        sx={{
          px: 1.5,
          py: 1,
          bgcolor: '#fff',
        }}
      >
        <Box
          sx={{
            height: 38,
            px: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: '#f0f2f5',
            borderRadius: 2,
          }}
        >
          <SearchIcon
            sx={{
              fontSize: 20,
              color: '#54656f',
            }}
          />

          <InputBase
            fullWidth
            placeholder="Поиск или новый чат"
            sx={{
              fontSize: 14,
              color: '#111b21',
            }}
          />
        </Box>
      </Box>

      {/* Chats */}

      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
        }}
      >
        {chats.length === 0 ? (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 3,
              textAlign: 'center',
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Здесь будут отображаться ваши чаты
            </Typography>
          </Box>
        ) : (
          chats.map((chat) => {
            const isActive =
              activeChat?.chatId === chat.chatId

            return (
              <Box
                key={chat.id}
                onClick={() => onSelectChat(chat)}
                sx={{
                  height: 72,
                  px: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  cursor: 'pointer',
                  bgcolor: isActive
                    ? '#f0f2f5'
                    : '#fff',
                  '&:hover': {
                    bgcolor: '#f5f6f6',
                  },
                  borderBottom:
                    '1px solid #f0f2f5',
                }}
              >
                {/* Avatar */}

                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    flexShrink: 0,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#dfe5e7',
                    color: '#54656f',
                    fontSize: 18,
                    fontWeight: 600,
                  }}
                >
                  {chat.name
                    .charAt(0)
                    .toUpperCase()}
                </Box>

                {/* Chat information */}

                <Box
                  sx={{
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      alignItems: 'center',
                      gap: 1,
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

                    {chat.lastMessageTime && (
                      <Typography
                        variant="caption"
                        sx={{
                          flexShrink: 0,
                          color: '#667781',
                        }}
                      >
                        {chat.lastMessageTime}
                      </Typography>
                    )}
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent:
                        'space-between',
                      gap: 1,
                    }}
                  >
                    <Typography
                      noWrap
                      sx={{
                        mt: 0.3,
                        fontSize: 14,
                        color: '#667781',
                      }}
                    >
                      {chat.lastMessage ||
                        'Новый чат'}
                    </Typography>

                    <IconButton
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation()

                        onDeleteChat(
                          chat.chatId,
                        )
                      }}
                      sx={{
                        opacity: 0,
                        color: '#667781',
                        transition:
                          'opacity 0.15s',
                        '.MuiBox-root:hover &': {
                          opacity: 1,
                        },
                      }}
                    >
                      <DeleteIcon
                        sx={{
                          fontSize: 18,
                        }}
                      />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            )
          })
        )}
      </Box>
    </Box>
  )
}

export default ChatList