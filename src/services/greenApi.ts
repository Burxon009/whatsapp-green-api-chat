const GREEN_API_URL = 'https://api.green-api.com'

export interface GreenApiConfig {
  idInstance: string
  apiTokenInstance: string
}

export interface InstanceStateResponse {
  stateInstance: string
}

export interface SendMessageResponse {
  idMessage: string
}

export interface CheckAccountResponse {
  exist: boolean
  chatId: string
}

export interface GreenApiChat {
  archive: boolean
  id: string
  name: string
  type: string
  unreadCount: number
}

export interface ChatHistoryMessage {
  type: 'incoming' | 'outgoing'
  idMessage: string
  timestamp: number
  statusMessage?: string
  sendByApi?: boolean
  typeMessage?: string
  textMessage?: string
  textMessageData?: {
    textMessage?: string
  }
}

async function handleResponse<T>(
  response: Response,
): Promise<T> {
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      data?.message ||
      data?.reason ||
      `GREEN-API error: ${response.status}`

    throw new Error(message)
  }

  return data as T
}

export async function getInstanceState(
  config: GreenApiConfig,
): Promise<InstanceStateResponse> {
  const { idInstance, apiTokenInstance } = config

  const response = await fetch(
    `${GREEN_API_URL}/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`,
  )

  return handleResponse<InstanceStateResponse>(response)
}

export async function sendMessage(
  config: GreenApiConfig,
  chatId: string,
  message: string,
): Promise<SendMessageResponse> {
  const { idInstance, apiTokenInstance } = config

  const response = await fetch(
    `${GREEN_API_URL}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId,
        message,
      }),
    },
  )

  return handleResponse<SendMessageResponse>(response)
}

export async function checkAccount(
  config: GreenApiConfig,
  phoneNumber: string,
): Promise<CheckAccountResponse> {
  const { idInstance, apiTokenInstance } = config

  const response = await fetch(
    `${GREEN_API_URL}/waInstance${idInstance}/checkWhatsapp/${apiTokenInstance}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: Number(phoneNumber),
      }),
    },
  )

  const data = await handleResponse<{
    existsWhatsapp: boolean
    chatId: string
  }>(response)

  return {
    exist: data.existsWhatsapp,
    chatId: data.chatId,
  }
}

export interface ReceivedNotification {
  receiptId: number
  body: {
    typeWebhook: string
    idMessage: string
    timestamp: number
    senderData: {
      chatId: string
      sender: string
      senderName?: string
    }
    messageData: {
      typeMessage: string
      textMessageData?: {
        textMessage: string
      }
    }
  }
}

export async function receiveNotification(
  config: GreenApiConfig,
): Promise<ReceivedNotification | null> {
  const { idInstance, apiTokenInstance } = config

  const response = await fetch(
    `${GREEN_API_URL}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}?receiveTimeout=5`,
  )

  if (!response.ok) {
    throw new Error(
      `GREEN-API error: ${response.status}`,
    )
  }

  const text = await response.text()

  if (!text) {
    return null
  }

  return JSON.parse(text) as ReceivedNotification
}

export async function deleteNotification(
  config: GreenApiConfig,
  receiptId: number,
): Promise<void> {
  const { idInstance, apiTokenInstance } = config

  const response = await fetch(
    `${GREEN_API_URL}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
    {
      method: 'DELETE',
    },
  )

  if (!response.ok) {
    throw new Error(
      `GREEN-API error: ${response.status}`,
    )
  }
}

export async function getChats(
  config: GreenApiConfig,
): Promise<GreenApiChat[]> {
  const { idInstance, apiTokenInstance } = config

  const response = await fetch(
    `${GREEN_API_URL}/waInstance${idInstance}/getChats/${apiTokenInstance}`,
  )

  return handleResponse<GreenApiChat[]>(response)
}

export async function getChatHistory(
  config: GreenApiConfig,
  chatId: string,
  count = 100,
): Promise<ChatHistoryMessage[]> {
  const { idInstance, apiTokenInstance } = config

  const response = await fetch(
    `${GREEN_API_URL}/waInstance${idInstance}/getChatHistory/${apiTokenInstance}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId,
        count,
      }),
    },
  )

  return handleResponse<ChatHistoryMessage[]>(
    response,
  )
}