# TanStack Query Migration & Optimization Guide

## Overview

This codebase has been migrated from SWR to TanStack Query (React Query) for better performance, user experience, and proper cache management.

## Key Improvements

### 1. **Centralized Query Key Management**

- **File**: `lib/query-keys.ts`
- All query keys are defined in a single location
- Ensures consistent cache invalidation across the app
- Type-safe query key factory pattern

### 2. **Optimized Query Configuration**

- **File**: `components/providers/query-provider.tsx`
- Stale time: 30 seconds (data considered fresh)
- Cache time: 5 minutes (data kept in memory)
- Smart retry logic with exponential backoff
- React Query Devtools in development mode

### 3. **Enhanced Hooks**

#### QR Code Hooks

**`useQRCodes`** (Query Hook)

- Uses `placeholderData` for smooth transitions between pages
- Automatic refetching when filters change
- Proper loading and error states

**`useCreateQRCode`** (Mutation Hook)

- Automatic cache invalidation after creation
- Loading toast notifications
- Success/error handling
- Returns both async and sync methods

**`useUpdateQRCode`** (Mutation Hook)

- **Optimistic updates** - UI updates instantly
- Automatic rollback on error
- Updates all related caches (lists and detail)
- Loading states and toast notifications

**`useDeleteQRCode`** (Mutation Hook)

- **Optimistic deletion** - Instant UI feedback
- Automatic rollback on error
- Proper cache cleanup
- Updates pagination counts

#### Auth Hooks

**`useCurrentUser`** (Query Hook)

- Only fetches when auth token exists
- Automatic refetch after login/register
- Proper error handling

**`useAuth`** (Mutation Hooks)

- Separate loading states for each operation:
  - `isLoginLoading`
  - `isRegisterLoading`
  - `isVerifyOtpLoading`
  - `isForgotPasswordLoading`
  - `isResetPasswordLoading`
  - `isChangePasswordLoading`
- Automatic cache invalidation after auth changes
- Toast notifications for all operations
- Both async and sync methods available

**`useAllUsers`** (Query Hook)

- Only fetches when authenticated
- Proper error handling

## Usage Examples

### Fetching Data

```tsx
const { qrCodes, pagination, isLoading, isFetching } = useQRCodes({
  page: 1,
  pageSize: 10,
  search: "game",
  status: "active",
  sortBy: "createdAt",
  sortOrder: "desc",
});

// isLoading: true on initial fetch
// isFetching: true on any fetch (including refetch)
```

### Creating Data

```tsx
const { create, isLoading } = useCreateQRCode();

const handleCreate = async (data: CreateQRCodeInput) => {
  try {
    const result = await create(data);
    // Cache automatically invalidated
    // Toast notification shown
    console.log("Created:", result);
  } catch (error) {
    // Error toast shown automatically
    console.error(error);
  }
};
```

### Updating Data (with Optimistic Updates)

```tsx
const { update, isLoading } = useUpdateQRCode();

const handleUpdate = async (id: string, data: UpdateQRCodeInput) => {
  try {
    // UI updates immediately (optimistic)
    await update(id, data);
    // If successful, cache is updated with server response
    // If error, UI rolls back automatically
  } catch (error) {
    // Already rolled back
    console.error(error);
  }
};
```

### Deleting Data (with Optimistic Updates)

```tsx
const { delete: deleteQR, isLoading } = useDeleteQRCode();

const handleDelete = async (id: string) => {
  try {
    // Item removed from UI immediately
    await deleteQR(id);
    // If successful, cache is cleaned up
    // If error, item reappears
  } catch (error) {
    console.error(error);
  }
};
```

### Authentication

```tsx
const { login, isLoginLoading, logout } = useAuth();

const handleLogin = async (credentials: LoginInput) => {
  try {
    await login(credentials);
    // Automatically redirects to dashboard
    // User data cached
  } catch (error) {
    // Error toast shown
  }
};

const handleLogout = () => {
  logout();
  // All auth caches cleared
  // Redirects to login
};
```

## Benefits

### Performance

- **Reduced Network Requests**: Smart caching prevents unnecessary API calls
- **Instant UI Updates**: Optimistic updates make the app feel instant
- **Background Refetching**: Data stays fresh without blocking UI

### User Experience

- **Loading States**: Clear feedback during operations
- **Error Handling**: Automatic error messages with toast notifications
- **Smooth Transitions**: Placeholder data prevents layout shifts
- **Rollback on Error**: Failed operations don't leave UI in broken state

### Developer Experience

- **Type Safety**: Full TypeScript support
- **Devtools**: Visual debugging in development
- **Centralized Keys**: Easy cache management
- **Consistent Patterns**: All hooks follow same structure

## Cache Invalidation Patterns

### After Create

```tsx
// Invalidates all list queries
queryClient.invalidateQueries({
  queryKey: queryKeys.qrCodes.lists(),
});
```

### After Update

```tsx
// Optimistically update, then invalidate
queryClient.setQueryData(queryKeys.qrCodes.detail(id), newData);
queryClient.invalidateQueries({
  queryKey: queryKeys.qrCodes.lists(),
});
```

### After Delete

```tsx
// Remove detail cache
queryClient.removeQueries({
  queryKey: queryKeys.qrCodes.detail(id),
});
// Invalidate lists
queryClient.invalidateQueries({
  queryKey: queryKeys.qrCodes.lists(),
});
```

## Debugging

### React Query Devtools

- Available in development mode
- Bottom-right corner of the screen
- Shows all queries, their status, and cached data
- Can manually trigger refetch or invalidation

### Console Logging

All mutation errors are logged to console with full error details.

## Migration Notes

### Removed Dependencies

- Can remove `swr` from package.json if not used elsewhere

### Breaking Changes

- `mutate` from SWR replaced with `invalidateQueries`
- Hook return values slightly different (check types)
- No more `window.location.reload()` needed

## Best Practices

1. **Always use query keys from `query-keys.ts`**
2. **Use optimistic updates for better UX**
3. **Handle loading states in UI**
4. **Let hooks handle toast notifications**
5. **Use devtools during development**
6. **Invalidate related queries after mutations**

## Future Enhancements

- Add infinite scroll with `useInfiniteQuery`
- Implement prefetching for better performance
- Add mutation queues for offline support
- Set up persistent cache with localStorage
