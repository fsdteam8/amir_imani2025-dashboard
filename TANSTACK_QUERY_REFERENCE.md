# TanStack Query Quick Reference

## Common Patterns

### Fetching Data

```tsx
import { useQRCodes } from "@/lib/hooks";

function MyComponent() {
  const { qrCodes, isLoading, isFetching, error } = useQRCodes({
    page: 1,
    pageSize: 10,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {isFetching && <div>Updating...</div>}
      {qrCodes.map((qr) => (
        <div key={qr._id}>{qr.gameName}</div>
      ))}
    </div>
  );
}
```

### Creating Data

```tsx
import { useCreateQRCode } from "@/lib/hooks";

function CreateForm() {
  const { create, isLoading } = useCreateQRCode();

  const handleSubmit = async (data) => {
    try {
      const result = await create(data);
      console.log("Created:", result);
      // Cache automatically invalidated
      // Success toast shown
    } catch (error) {
      // Error toast shown
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={isLoading}>
        {isLoading ? "Creating..." : "Create"}
      </button>
    </form>
  );
}
```

### Updating Data (Optimistic)

```tsx
import { useUpdateQRCode } from "@/lib/hooks";

function EditForm({ id }) {
  const { update, isLoading } = useUpdateQRCode();

  const handleSubmit = async (data) => {
    try {
      // UI updates immediately
      await update(id, data);
      // Server confirms, cache updated
    } catch (error) {
      // UI automatically rolled back
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button disabled={isLoading}>
        {isLoading ? "Updating..." : "Update"}
      </button>
    </form>
  );
}
```

### Deleting Data (Optimistic)

```tsx
import { useDeleteQRCode } from "@/lib/hooks";

function DeleteButton({ id }) {
  const { delete: deleteQR, isLoading } = useDeleteQRCode();

  const handleDelete = async () => {
    if (!confirm("Are you sure?")) return;

    try {
      // Item removed from UI immediately
      await deleteQR(id);
      // Server confirms, cache cleaned up
    } catch (error) {
      // Item reappears in UI
    }
  };

  return (
    <button onClick={handleDelete} disabled={isLoading}>
      {isLoading ? "Deleting..." : "Delete"}
    </button>
  );
}
```

### Authentication

```tsx
import { useAuth, useCurrentUser } from "@/lib/hooks";

function LoginForm() {
  const { login, isLoginLoading } = useAuth();

  const handleSubmit = async (credentials) => {
    try {
      await login(credentials);
      // Automatically redirects to dashboard
      // User data cached
    } catch (error) {
      // Error toast shown
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button disabled={isLoginLoading}>
        {isLoginLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

function UserProfile() {
  const { user, isLoading } = useCurrentUser();

  if (isLoading) return <div>Loading...</div>;

  return <div>Welcome, {user?.name}</div>;
}
```

### Global Loading State

```tsx
import { useGlobalLoading } from "@/lib/hooks";

function GlobalLoadingIndicator() {
  const { isLoading, isFetching, isMutating } = useGlobalLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-blue-500 animate-pulse">
      {isFetching && <div>Fetching data...</div>}
      {isMutating && <div>Saving changes...</div>}
    </div>
  );
}
```

## Hook Return Values

### Query Hooks (useQRCodes, useCurrentUser, etc.)

```tsx
{
  data,           // The actual data
  isLoading,      // Initial loading (no cached data)
  isFetching,     // Any fetch (including refetch)
  isError,        // Query failed
  error,          // Error object
  refetch,        // Manual refetch function
}
```

### Mutation Hooks (useCreateQRCode, useUpdateQRCode, etc.)

```tsx
{
  mutate,         // Async function (returns promise)
  mutateSync,     // Sync function (fire and forget)
  isLoading,      // Mutation in progress (alias for isPending)
  isPending,      // Mutation in progress
  isSuccess,      // Mutation succeeded
  isError,        // Mutation failed
  error,          // Error object
  reset,          // Reset mutation state
}
```

### Auth Hook (useAuth)

```tsx
{
  // Methods
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyOtp,

  // Loading states
  isLoading,                    // Any auth operation
  isLoginLoading,               // Login in progress
  isRegisterLoading,            // Register in progress
  isForgotPasswordLoading,      // Forgot password in progress
  isResetPasswordLoading,       // Reset password in progress
  isChangePasswordLoading,      // Change password in progress
  isVerifyOtpLoading,           // Verify OTP in progress

  // Error
  error,                        // Any auth error
}
```

## Query Keys Reference

```tsx
import { queryKeys } from "@/lib/query-keys";

// QR Codes
queryKeys.qrCodes.all; // ['qr-codes']
queryKeys.qrCodes.lists(); // ['qr-codes', 'list']
queryKeys.qrCodes.list({ page: 1 }); // ['qr-codes', 'list', { page: 1, ... }]
queryKeys.qrCodes.detail("123"); // ['qr-codes', 'detail', '123']

// Auth
queryKeys.auth.all; // ['auth']
queryKeys.auth.currentUser(); // ['auth', 'current-user']
queryKeys.auth.users(); // ['auth', 'users']
```

## Manual Cache Operations

### Invalidate Queries

```tsx
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

function MyComponent() {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    // Invalidate all QR code lists
    queryClient.invalidateQueries({
      queryKey: queryKeys.qrCodes.lists(),
    });
  };

  return <button onClick={handleRefresh}>Refresh</button>;
}
```

### Update Cache Directly

```tsx
const queryClient = useQueryClient();

// Update specific query
queryClient.setQueryData(queryKeys.qrCodes.detail("123"), {
  data: updatedQRCode,
});

// Update all matching queries
queryClient.setQueriesData(
  { queryKey: queryKeys.qrCodes.lists() },
  (oldData) => {
    // Transform old data
    return newData;
  }
);
```

### Remove from Cache

```tsx
const queryClient = useQueryClient();

// Remove specific query
queryClient.removeQueries({
  queryKey: queryKeys.qrCodes.detail("123"),
});

// Remove all QR code queries
queryClient.removeQueries({
  queryKey: queryKeys.qrCodes.all,
});
```

### Prefetch Data

```tsx
const queryClient = useQueryClient();

const handleMouseEnter = () => {
  queryClient.prefetchQuery({
    queryKey: queryKeys.qrCodes.detail("123"),
    queryFn: () => qrCodeService.getById("123"),
  });
};
```

## Debugging

### React Query Devtools

- Press the floating icon in bottom-right corner (development only)
- View all queries and their states
- Inspect cached data
- Manually trigger refetch or invalidation
- See query timings and network activity

### Console Logging

```tsx
const { data } = useQRCodes({
  page: 1,
  // Add meta for debugging
  meta: {
    debug: true,
  },
});

// All errors are automatically logged
```

### Check Cache State

```tsx
import { useQueryClient } from "@tanstack/react-query";

function DebugComponent() {
  const queryClient = useQueryClient();

  const logCache = () => {
    const cache = queryClient.getQueryCache().getAll();
    console.log("All queries:", cache);
  };

  return <button onClick={logCache}>Log Cache</button>;
}
```

## Common Issues & Solutions

### Issue: Data not updating after mutation

**Solution**: Make sure you're invalidating the correct query keys

```tsx
// ❌ Wrong
queryClient.invalidateQueries({ queryKey: ["wrong-key"] });

// ✅ Correct
queryClient.invalidateQueries({
  queryKey: queryKeys.qrCodes.lists(),
});
```

### Issue: Optimistic update not working

**Solution**: Return context from onMutate for rollback

```tsx
onMutate: async (variables) => {
  // Cancel queries
  await queryClient.cancelQueries({ queryKey })

  // Snapshot previous value
  const previous = queryClient.getQueryData(queryKey)

  // Optimistic update
  queryClient.setQueryData(queryKey, newData)

  // Return context for rollback
  return { previous }
},
onError: (err, variables, context) => {
  // Rollback
  queryClient.setQueryData(queryKey, context.previous)
}
```

### Issue: Too many network requests

**Solution**: Increase staleTime or use placeholderData

```tsx
useQuery({
  queryKey,
  queryFn,
  staleTime: 5 * 60 * 1000, // 5 minutes
  placeholderData: (previousData) => previousData,
});
```

### Issue: Query not fetching when it should

**Solution**: Check enabled condition

```tsx
useQuery({
  queryKey,
  queryFn,
  enabled: !!userId, // Only fetch when userId exists
});
```

## Performance Tips

1. **Use staleTime wisely**: Set appropriate stale times based on data freshness requirements
2. **Implement optimistic updates**: For better perceived performance
3. **Use placeholderData**: To prevent layout shifts during refetch
4. **Prefetch on hover**: For instant navigation
5. **Batch invalidations**: Invalidate multiple queries at once
6. **Use query keys correctly**: Leverage the hierarchical structure
7. **Avoid over-fetching**: Only fetch what you need
8. **Use enabled option**: Don't fetch until ready

## Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Query Devtools](https://tanstack.com/query/latest/docs/react/devtools)
- [Query Keys Guide](https://tanstack.com/query/latest/docs/react/guides/query-keys)
- [Optimistic Updates](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)
