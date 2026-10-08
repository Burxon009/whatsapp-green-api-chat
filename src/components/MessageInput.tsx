import { useState } from 'react'
import {
  Box,
  CircularProgress,
  IconButton,
  TextField,
} from '@mui/material'

import SendIcon from '@mui/icons-material/Send'


import { sendMessage } from '../services/greenApi'

import type { GreenApiConfig } from '../services/greenApi'
import type { Message } from '../types/chat'

interface MessageInputProps {
  config: GreenApiConfig
  chatId: string
  onMessageSent: (message: Message) => void
}

function MessageInput({
  config,
  chatId,
  onMessageSent,
}: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    const text = message.trim()

    if (!text || loading) return

    try {
      setLoading(true)

      const result = await sendMessage(
        config,
        chatId,
        text,
      )

      const newMessage: Message = {
        id: result.idMessage,
        text,
        timestamp: new Date().toISOString(),
        fromMe: true,
      }

      onMessageSent(newMessage)
      setMessage('')
    }  catch (error) {
  console.error(
    'Ошибка отправки сообщения:',
    error,
  )

  window.alert(
    'Не удалось отправить сообщение. Проверьте подключение к GREEN-API.',
  )
} finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        display: 'flex',
        alignItems: 'flex-end',
        gap: 1,
        bgcolor: '#f0f2f5',
        borderTop: '1px solid #d1d7db',
      }}
    >
     

     

      <TextField
        fullWidth
        multiline
        maxRows={5}
        placeholder="Введите сообщение"
        value={message}
        disabled={loading}
        onChange={(event) =>
          setMessage(event.target.value)
        }
        onKeyDown={(event) => {
          if (
            event.key === 'Enter' &&
            !event.shiftKey
          ) {
            event.preventDefault()
            handleSend()
          }
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: '#fff',
            borderRadius: 3,
            fontSize: 15,
            py: 0.5,

            '& fieldset': {
              border: 'none',
            },

            '&:hover fieldset': {
              border: 'none',
            },

            '&.Mui-focused fieldset': {
              border: 'none',
            },
          },
        }}
      />

      <IconButton
        onClick={handleSend}
        disabled={
          loading || !message.trim()
        }
        sx={{
          width: 46,
          height: 46,
          color: '#54656f',

          '&.Mui-disabled': {
            color: '#aebac1',
          },
        }}
      >
        {loading ? (
          <CircularProgress size={22} />
        ) : (
          <SendIcon />
        )}
      </IconButton>
    </Box>
  )
}

export default MessageInput