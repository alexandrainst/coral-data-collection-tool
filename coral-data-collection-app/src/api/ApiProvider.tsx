import { createContext, FC, ReactNode, useContext } from 'react'
import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { TextRecordingKey, UserDataKey } from '../types'

export const createGenericContext = <T extends unknown>() => {
  // Create a context with a generic parameter or undefined
  const genericContext = createContext<T | undefined>(undefined)

  // Check if the value provided to the context is defined or throw an error
  const useGenericContext = () => {
    const contextIsDefined = useContext(genericContext)
    if (!contextIsDefined) {
      throw new Error('useGenericContext must be used within a Provider')
    }
    return contextIsDefined
  }

  return [useGenericContext, genericContext.Provider] as const
}

export interface ApiType {
  client: QueryClient
  getTextToRecord: () => Promise<string>
  postTextRecording: (key: TextRecordingKey) => Promise<boolean>
  postUserData: (key: UserDataKey) => Promise<boolean>
}

const [useApiTypeContext, ApiTypeContextProvider] =
  createGenericContext<ApiType>()

export const useApi = (): ApiType => useApiTypeContext()

interface ApiProviderProps {
  domainName?: string
  children?: ReactNode
}

export const ApiProvider: FC<ApiProviderProps> = ({
  children,
  domainName = 'localhost',
}: ApiProviderProps) => {
  const client = useQueryClient()

  const postUserData = async (key: UserDataKey): Promise<boolean> => {
    // return fetch(`${domainName}/user`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(key),
    // }).then(response => {
    //   if (!response.ok) {
    //     console.log(
    //       `POST user response error status: ${response.statusText}`
    //     )
    //   }
    //   return response.ok
    // })
    return key.age !== '' && domainName !== ''
  }

  const postTextRecording = async (key: TextRecordingKey): Promise<boolean> => {
    // return fetch(`${domainName}/recording`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/octet-stream' },
    //   body: key.recording,
    // }).then(response => {
    //   if (!response.ok) {
    //     console.log(
    //       `POST recording response error status: ${response.statusText}`
    //     )
    //   }
    //   return response.ok
    // })
    return key.id === ''
  }

  const getTextToRecord = async (): Promise<string> => {
    // return fetch(`${domainName}/text`, {
    //   method: 'GET',
    //   headers: {
    //     Accept: 'application/json',
    //   },
    // }).then(response => {
    //   if (!response.ok) {
    //     console.log(`Get text response error status: ${response.statusText}`)
    //     throw new Error('Network response was not ok')
    //   }
    //   return response.json()
    // })
    return Math.random().toString(36).substring(0, 11)
  }

  return (
    <ApiTypeContextProvider
      value={{
        client,
        getTextToRecord,
        postTextRecording,
        postUserData,
      }}
    >
      {children}
    </ApiTypeContextProvider>
  )
}
