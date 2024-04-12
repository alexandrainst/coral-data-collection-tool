import { createContext, FC, ReactNode, useContext } from 'react'
import { QueryClient, useQueryClient } from '@tanstack/react-query'

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

  //   const patchValidateRecording = async (
  //     key: RecordingValidation
  //   ): Promise<boolean> => {
  //     return fetch(`${domainName}/validate`, {
  //       method: 'PATCH',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(key),
  //     }).then(response => {
  //       if (!response.ok) {
  //         console.log(
  //           `Patch recording response error status: ${response.statusText}`
  //         )
  //       }
  //       return response.ok
  //     })
  //   }

  return (
    <ApiTypeContextProvider
      value={{
        client,
      }}
    >
      {children}
    </ApiTypeContextProvider>
  )
}
