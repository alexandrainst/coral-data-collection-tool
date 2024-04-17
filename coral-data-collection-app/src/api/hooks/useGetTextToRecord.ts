import { useApi } from '../ApiProvider'
import {
  UseQueryResult,
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query'

export const useGetTextToRecord = (
  key: number
): UseQueryResult<string, Error> => {
  const { getTextToRecord } = useApi()

  return useQuery<string, Error>({
    queryKey: ['textToRecord', key],
    queryFn: async () => getTextToRecord(),
    staleTime: Infinity,
    placeholderData: keepPreviousData,
  })
}
