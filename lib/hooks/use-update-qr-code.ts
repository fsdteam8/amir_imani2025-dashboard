import { useState } from 'react'
import { qrCodeService } from '@/lib/api/qr-code-service'
import type { UpdateQRCodeInput, QRCode } from '@/lib/types/qr-code'
import { toast } from 'sonner'

export function useUpdateQRCode() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = async (id: string, input: UpdateQRCodeInput): Promise<QRCode | null> => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await qrCodeService.update(id, input)
      toast.success('QR code updated successfully')
      return response.data
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to update QR code'
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { update, isLoading, error }
}
