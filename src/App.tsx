import { useState } from 'react'

import ChatPage from './pages/ChatPage'
import ConnectionForm from './components/ConnectionForm'

import {
  getInstanceState,
} from './services/greenApi'

import type {
  GreenApiConfig,
} from './services/greenApi'

function App() {
  const [config, setConfig] =
    useState<GreenApiConfig | null>(null)

  const handleConnect = async (
    idInstance: string,
    apiTokenInstance: string,
  ) => {
    const newConfig: GreenApiConfig = {
      idInstance,
      apiTokenInstance,
    }

    const result =
      await getInstanceState(newConfig)

    if (result.stateInstance !== 'authorized') {
      throw new Error(
        `Инстанс не авторизован. Текущее состояние: ${result.stateInstance}`,
      )
    }

    setConfig(newConfig)
  }

  if (!config) {
    return (
      <ConnectionForm
        onConnect={handleConnect}
      />
    )
  }

  return <ChatPage config={config} />
}

export default App