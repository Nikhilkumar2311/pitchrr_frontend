# State Management Guide

This document explains when to use different state management approaches.

## The Three Types of State

| Type | Where it Lives | When to Use |
|------|----------------|-------------|
| Local State | `useState` | UI-only, single component |
| Zustand | Global store | App-wide, client-side |
| React Query | Query cache | Server data, API responses |

---

## 1. Local State (`useState`)

Use for state that:
- Only one component needs
- Doesn't need to persist
- Is purely UI-related

**Examples:**
```tsx
const [isModalOpen, setIsModalOpen] = useState(false);
const [inputValue, setInputValue] = useState('');
const [showPassword, setShowPassword] = useState(false);
```

---

## 2. Zustand (Global Client State)

Use for state that:
- Multiple components need
- Persists across page navigation
- Is client-side only (not from server)

**Examples:**
- User authentication (`authStore`)
- Sidebar open/collapsed state (`uiStore`)
- Theme preferences
- Shopping cart

**When NOT to use:**
- Server data (use React Query instead)
- Form inputs (use local state)

---

## 3. React Query (Server State)

Use for:
- Data from API calls
- Cached responses
- Loading/error states
- Background refetching

**Examples:**
```tsx
// Fetch user data
const { data, isLoading } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => api.get(`/users/${userId}`)
});

// Mutate data
const mutation = useMutation({
  mutationFn: (newData) => api.post('/users', newData),
  onSuccess: () => queryClient.invalidateQueries(['users'])
});
```

---

## Decision Tree

```
Is it from an API?
├── Yes → React Query
└── No → Does multiple components need it?
    ├── Yes → Zustand
    └── No → useState
```

---

## Current Stores

### authStore.ts
- `user` - Current user object
- `isAuthenticated` - Quick auth check
- `login/logout/register` - Auth actions

### uiStore.ts
- `isSidebarOpen` - Mobile sidebar drawer
- `isSidebarCollapsed` - Desktop collapsed mode
