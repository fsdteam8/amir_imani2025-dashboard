# 🚀 TanStack Query Implementation - Complete Guide

## 📖 Overview

This project has been optimized with **TanStack Query (React Query)** for superior performance, better user experience, and proper cache management. All data fetching and mutations now use TanStack Query instead of SWR.

## 🎯 What Changed?

### ✅ Implemented Features

- **Optimistic Updates** - UI updates instantly, rolls back on error
- **Smart Caching** - Reduces network requests, keeps data fresh
- **Automatic Cache Invalidation** - No more manual page reloads
- **Loading States** - Granular loading indicators for better UX
- **Error Handling** - Automatic rollback and error messages
- **Toast Notifications** - Consistent user feedback
- **Type Safety** - Full TypeScript support
- **Developer Tools** - React Query Devtools for debugging

### 🔧 Technical Improvements

- Migrated from SWR to TanStack Query
- Centralized query key management
- Optimized QueryClient configuration
- Implemented optimistic updates for mutations
- Added comprehensive error handling
- Removed all `window.location.reload()` calls

## 📚 Documentation

### Quick Start

1. **[MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)** - Overview of all changes
2. **[TANSTACK_QUERY_GUIDE.md](./TANSTACK_QUERY_GUIDE.md)** - Complete usage guide
3. **[TANSTACK_QUERY_REFERENCE.md](./TANSTACK_QUERY_REFERENCE.md)** - Quick reference
4. **[PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md)** - Performance details

### For Developers

- Start with **MIGRATION_SUMMARY.md** for an overview
- Use **TANSTACK_QUERY_REFERENCE.md** for quick code snippets
- Read **TANSTACK_QUERY_GUIDE.md** for in-depth understanding
- Check **PERFORMANCE_OPTIMIZATION.md** for performance insights

## 🎨 Key Features

### 1. Optimistic Updates

```tsx
// UI updates immediately, rolls back on error
const { update } = useUpdateQRCode();
await update(id, data); // Instant feedback!
```

### 2. Smart Caching

```tsx
// Data cached for 5 minutes, fresh for 30 seconds
// Automatic deduplication of requests
const { qrCodes } = useQRCodes({ page: 1 });
```

### 3. Automatic Invalidation

```tsx
// No more window.location.reload()!
// Cache automatically invalidated after mutations
const { create } = useCreateQRCode();
await create(data); // List automatically refreshes
```

### 4. Loading States

```tsx
// Multiple loading states for better UX
const { isLoading, isFetching } = useQRCodes();
// isLoading: initial load
// isFetching: any fetch (including background)
```

### 5. Error Handling

```tsx
// Automatic rollback on error
const { delete: deleteQR } = useDeleteQRCode();
await deleteQR(id); // Reverts if fails
```

## 🛠️ Available Hooks

### Query Hooks (Data Fetching)

- `useQRCodes()` - Fetch QR codes with pagination/filters
- `useCurrentUser()` - Get current authenticated user
- `useAllUsers()` - Get all users (admin)

### Mutation Hooks (Data Modification)

- `useCreateQRCode()` - Create new QR code
- `useUpdateQRCode()` - Update QR code (optimistic)
- `useDeleteQRCode()` - Delete QR code (optimistic)
- `useAuth()` - All auth operations (login, register, etc.)

### Utility Hooks

- `useGlobalLoading()` - Track all loading states
- `useQueryLoading()` - Track specific query loading
- `useMutationLoading()` - Track specific mutation loading
- `useQRCodeState()` - QR code state management
- `useDebounce()` - Debounce values

## 📦 Installation

Already installed! But if you need to set up from scratch:

```bash
npm install @tanstack/react-query
npm install -D @tanstack/react-query-devtools
```

## 🚀 Usage Examples

### Fetching Data

```tsx
import { useQRCodes } from "@/lib/hooks";

function QRCodeList() {
  const { qrCodes, isLoading, pagination } = useQRCodes({
    page: 1,
    pageSize: 10,
    search: "game",
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
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
    await create(data);
    // ✅ Cache automatically invalidated
    // ✅ Success toast shown
    // ✅ List refreshes automatically
  };

  return (
    <button onClick={handleSubmit} disabled={isLoading}>
      {isLoading ? "Creating..." : "Create"}
    </button>
  );
}
```

### Updating Data (Optimistic)

```tsx
import { useUpdateQRCode } from "@/lib/hooks";

function EditForm({ id }) {
  const { update, isLoading } = useUpdateQRCode();

  const handleSubmit = async (data) => {
    await update(id, data);
    // ✅ UI updates instantly
    // ✅ Rolls back if error
    // ✅ Cache synchronized
  };

  return (
    <button onClick={handleSubmit} disabled={isLoading}>
      {isLoading ? "Updating..." : "Update"}
    </button>
  );
}
```

### Authentication

```tsx
import { useAuth } from "@/lib/hooks";

function LoginForm() {
  const { login, isLoginLoading } = useAuth();

  const handleLogin = async (credentials) => {
    await login(credentials);
    // ✅ Auto redirects to dashboard
    // ✅ User data cached
    // ✅ Token stored
  };

  return (
    <button onClick={handleLogin} disabled={isLoginLoading}>
      {isLoginLoading ? "Logging in..." : "Login"}
    </button>
  );
}
```

## 🔍 Debugging

### React Query Devtools

- Available in development mode
- Floating icon in bottom-right corner
- Shows all queries, mutations, and cache state
- Can manually trigger refetch or invalidation

### Console Logging

- All mutation errors logged to console
- Query states visible in devtools
- Network requests tracked

## 📊 Performance Benefits

### Before Optimization

- ❌ Full page reloads on mutations
- ❌ Redundant network requests
- ❌ Slow perceived performance
- ❌ Lost scroll position
- ❌ Manual state management

### After Optimization

- ✅ No page reloads
- ✅ Smart caching and deduplication
- ✅ Instant perceived performance
- ✅ Preserved scroll position
- ✅ Automatic state management

## 🎓 Learning Path

1. **Start Here**: Read [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md)
2. **Quick Reference**: Use [TANSTACK_QUERY_REFERENCE.md](./TANSTACK_QUERY_REFERENCE.md)
3. **Deep Dive**: Study [TANSTACK_QUERY_GUIDE.md](./TANSTACK_QUERY_GUIDE.md)
4. **Performance**: Review [PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md)
5. **Practice**: Try the examples in the reference guide
6. **Debug**: Use React Query Devtools

## 🔗 Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [React Query Devtools](https://tanstack.com/query/latest/docs/react/devtools)
- [Optimistic Updates Guide](https://tanstack.com/query/latest/docs/react/guides/optimistic-updates)
- [Query Keys Guide](https://tanstack.com/query/latest/docs/react/guides/query-keys)

## ✅ Testing Checklist

Test the following to verify everything works:

- [ ] QR code list loads correctly
- [ ] Create QR code (check cache invalidation)
- [ ] Update QR code (verify optimistic update)
- [ ] Delete QR code (verify optimistic deletion)
- [ ] Error handling (verify rollback)
- [ ] Login flow
- [ ] Forgot password flow
- [ ] No page reloads occur
- [ ] Loading states display correctly
- [ ] Toast notifications appear
- [ ] React Query Devtools accessible

## 🆘 Troubleshooting

### Issue: Data not updating after mutation

**Solution**: Check React Query Devtools to verify cache invalidation

### Issue: Optimistic update not working

**Solution**: Verify onMutate returns context for rollback

### Issue: Too many network requests

**Solution**: Check staleTime configuration in query

### Issue: Query not fetching

**Solution**: Check enabled condition in query options

## 🎉 Summary

Your application now has:

- ✅ **Better Performance** - Smart caching, optimistic updates
- ✅ **Better UX** - Instant feedback, smooth transitions
- ✅ **Better DX** - Type safety, debugging tools, consistent patterns
- ✅ **Better Code Quality** - Centralized configuration, proper error handling

## 📞 Need Help?

1. Check the documentation files
2. Use React Query Devtools
3. Review console logs
4. Check query keys are correct
5. Verify cache invalidation is working

---

**Happy coding! 🚀**
