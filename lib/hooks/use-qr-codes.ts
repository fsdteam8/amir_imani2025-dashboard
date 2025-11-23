import useSWR from 'swr'
import { qrCodeService } from '@/lib/api/qr-code-service'
import type { PaginatedQRCodeResponse } from '@/lib/types/qr-code'

interface UseQRCodesOptions {
  page?: number
  pageSize?: number
  search?: string
  status?: string
  sortBy?: string
  sortOrder?: string
}

export function useQRCodes({
  page = 1,
  pageSize = 10,
  search = '',
  status = '',
  sortBy = 'createdAt',
  sortOrder = 'desc',
}: UseQRCodesOptions = {}) {
  const key = search || status ? 
    [`/qrcodes`, page, pageSize, search, status, sortBy, sortOrder].join('|') : 
    [`/qrcodes`, page, pageSize, sortBy, sortOrder].join('|')

  const { data, error, isLoading, mutate } = useSWR<PaginatedQRCodeResponse>(
    key,
    () => qrCodeService.list(page, pageSize, search, status, sortBy, sortOrder),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  )

  return {
    qrCodes: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    isError: !!error,
    error,
    mutate,
  }
}
