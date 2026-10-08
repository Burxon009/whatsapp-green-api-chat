import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material'

interface ConnectionFormProps {
  onConnect: (
    idInstance: string,
    apiTokenInstance: string,
  ) => Promise<void>
}

function ConnectionForm({
  onConnect,
}: ConnectionFormProps) {
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    const instance = idInstance.trim()
    const token = apiTokenInstance.trim()

    if (!instance || !token) {
      setError('Заполните оба поля')
      return
    }

    try {
      setError('')
      setLoading(true)

      await onConnect(instance, token)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Не удалось подключиться к GREEN-API',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f3f4f6',
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 440,
          p: 4,
          border: '1px solid #e5e7eb',
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 1,
          }}
        >
          Подключение GREEN-API
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Введите данные вашего инстанса GREEN-API
          для работы с WhatsApp.
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="ID Instance"
          placeholder="1101XXXXXXXX"
          value={idInstance}
          disabled={loading}
          onChange={(event) =>
            setIdInstance(event.target.value)
          }
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="API Token Instance"
          type="password"
          placeholder="Введите API token"
          value={apiTokenInstance}
          disabled={loading}
          onChange={(event) =>
            setApiTokenInstance(event.target.value)
          }
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={
            loading ||
            !idInstance.trim() ||
            !apiTokenInstance.trim()
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
          {loading ? 'Проверка...' : 'Подключиться'}
        </Button>
      </Paper>
    </Box>
  )
}

export default ConnectionForm