import { useState } from 'react'
import { qrCodeService } from '@/lib/api/qr-code-service'
import type { CreateQRCodeInput, QRCode } from '@/lib/types/qr-code'
import { toast } from 'sonner'

export function useCreateQRCode() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = async (input: CreateQRCodeInput): Promise<QRCode | null> => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await qrCodeService.create(input)
      toast.success('QR code created successfully')
      return response.data
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to create QR code'
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { create, isLoading, error }
}
