import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material'

import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import MoreVertIcon from '@mui/icons-material/MoreVert'

function Header() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: '#00a884',
        color: '#fff',
      }}
    >
      <Toolbar
        sx={{
          minHeight: 64,
          px: 2,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <WhatsAppIcon
            sx={{
              fontSize: 32,
            }}
          />

          <Typography
            sx={{
              fontSize: 21,
              fontWeight: 600,
              letterSpacing: '-0.3px',
            }}
          >
            WhatsApp
          </Typography>
        </Box>

        <IconButton
          sx={{
            color: '#fff',
          }}
        >
          <MoreVertIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default Header