import { useState } from 'react'
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material'

import {
  checkAccount,
} from '../services/greenApi'

import type {
  GreenApiConfig,
} from '../services/greenApi'

interface NewChatDialogProps {
  open: boolean
  config: GreenApiConfig
  onClose: () => void
  onCreate: (phone: string, chatId: string) => void
}

function NewChatDialog({
  open,
  config,
  onClose,
  onCreate,
}: NewChatDialogProps) {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    const value = phone.trim()

    if (!value) {
      setError('Введите номер телефона')
      return
    }

    try {
      setError('')
      setLoading(true)

      const result = await checkAccount(
        config,
        value,
      )

      if (!result.exist) {
        setError(
          'Этот номер не найден в WhatsApp',
        )
        return
      }

      onCreate(
        value,
        result.chatId,
      )

      setPhone('')
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Не удалось проверить номер',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (loading) return

    setPhone('')
    setError('')
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>
        Новый чат
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        <TextField
          autoFocus
          fullWidth
          label="Номер телефона"
          placeholder="+998901234567"
          value={phone}
          disabled={loading}
          onChange={(event) => {
            setPhone(event.target.value)
          }}
          sx={{ mt: 1 }}
        />

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Используйте международный формат номера.
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2,
        }}
      >
        <Button
          onClick={handleClose}
          disabled={loading}
        >
          Отмена
        </Button>

        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={
            loading ||
            !phone.trim()
          }
          startIcon={
            loading ? (
              <CircularProgress
                size={18}
                color="inherit"
              />
            ) : undefined
          }
        >
          {loading
            ? 'Проверка...'
            : 'Создать чат'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default NewChatDialog