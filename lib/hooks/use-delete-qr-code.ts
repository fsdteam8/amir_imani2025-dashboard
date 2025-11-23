import { useState } from 'react'
import { qrCodeService } from '@/lib/api/qr-code-service'
import { toast } from 'sonner'

export function useDeleteQRCode() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const delete_ = async (id: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    try {
      await qrCodeService.delete(id)
      toast.success('QR code deleted successfully')
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to delete QR code'
      setError(errorMessage)
      toast.error(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { delete: delete_, isLoading, error }
}
