/**
 * Centralized query key factory for TanStack Query
 * This ensures consistent cache management and invalidation
 */

export const queryKeys = {
  // QR Code queries
  qrCodes: {
    all: ["qr-codes"] as const,
    lists: () => [...queryKeys.qrCodes.all, "list"] as const,
    list: (filters: {
      page?: number;
      pageSize?: number;
      search?: string;
      status?: string;
      sortBy?: string;
      sortOrder?: string;
    }) => [...queryKeys.qrCodes.lists(), filters] as const,
    details: () => [...queryKeys.qrCodes.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.qrCodes.details(), id] as const,
  },

  // Auth queries
  auth: {
    all: ["auth"] as const,
    currentUser: () => [...queryKeys.auth.all, "current-user"] as const,
    users: () => [...queryKeys.auth.all, "users"] as const,
  },
} as const;
