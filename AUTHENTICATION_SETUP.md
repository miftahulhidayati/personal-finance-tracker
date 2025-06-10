# Authentication & Dark Mode Setup Guide

This guide covers the complete authentication system and dark mode implementation for your Personal Finance Tracker.

## 🚀 Features Implemented

### Authentication Features
- ✅ NextAuth.js integration with multiple providers
- ✅ Google OAuth sign-in
- ✅ Credentials-based authentication (demo)
- ✅ Protected routes with middleware
- ✅ User profile management
- ✅ Sign in/Sign up/Sign out functionality
- ✅ Authentication error handling

### Dark Mode Features
- ✅ System-wide dark mode support
- ✅ Theme persistence across sessions
- ✅ Theme toggle component
- ✅ CSS custom properties for theming
- ✅ Automatic system preference detection

### UI Components
- ✅ Modern authentication pages
- ✅ User navigation dropdown
- ✅ Theme toggle button
- ✅ Responsive layouts
- ✅ Loading states and error handling

## 📁 File Structure

```
src/
├── app/
│   ├── api/auth/[...nextauth]/
│   │   └── route.ts                 # NextAuth configuration
│   ├── auth/
│   │   ├── signin/page.tsx         # Sign in page
│   │   ├── signup/page.tsx         # Sign up page
│   │   └── error/page.tsx          # Auth error page
│   ├── profile/
│   │   ├── page.tsx                # User profile page
│   │   └── layout.tsx              # Profile layout
│   ├── layout.tsx                  # Root layout with providers
│   └── page.tsx                    # Landing page
├── components/
│   ├── features/auth/
│   │   └── user-nav.tsx            # User navigation dropdown
│   ├── layout/
│   │   ├── header.tsx              # Navigation header
│   │   └── main-layout.tsx         # Main app layout
│   ├── providers/
│   │   ├── session-provider.tsx    # NextAuth session provider
│   │   └── theme-provider.tsx      # Theme context provider
│   └── ui/
│       ├── theme-toggle.tsx        # Theme toggle component
│       ├── button.tsx              # Enhanced button component
│       ├── input.tsx               # Form input component
│       ├── label.tsx               # Form label component
│       ├── card.tsx                # Enhanced card component
│       └── separator.tsx           # Visual separator component
├── types/
│   ├── index.ts                    # Updated with auth types
│   └── next-auth.d.ts              # NextAuth type extensions
├── middleware.ts                   # Route protection middleware
└── globals.css                     # Dark mode CSS variables
```

## 🔧 Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in your project root:

```bash
# Required for NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 2. Google OAuth Setup (Optional)

If you want to enable Google sign-in:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### 3. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Use the output as your `NEXTAUTH_SECRET`.

## 🎨 Dark Mode Implementation

### CSS Custom Properties

The theme system uses CSS custom properties defined in `globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 84 81% 60%;
  /* ... more variables */
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --primary: 84 81% 60%;
  /* ... dark mode variables */
}
```

### Theme Provider

The `ThemeProvider` component manages theme state and persistence:

```tsx
import { ThemeProvider } from '@/components/providers/theme-provider'

// Wrap your app
<ThemeProvider defaultTheme="system">
  {children}
</ThemeProvider>
```

### Using the Theme Toggle

```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle'

function Header() {
  return (
    <header>
      <ThemeToggle />
    </header>
  )
}
```

## 🛡️ Authentication Flow

### Sign In Process

1. User visits `/auth/signin`
2. Chooses between Google OAuth or credentials
3. For credentials: any email/password combination works (demo)
4. Successful authentication redirects to `/dashboard`
5. Failed authentication shows error message

### Route Protection

Protected routes are defined in `middleware.ts`:

```typescript
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/budgeting/:path*',
    '/spending/:path*',
    '/analytics/:path*'
  ]
}
```

### Session Management

Sessions are managed by NextAuth and persist across browser sessions.

## 🧩 Component Usage

### User Navigation

```tsx
import { UserNav } from '@/components/features/auth/user-nav'

function Header() {
  return (
    <header>
      <UserNav />
    </header>
  )
}
```

### Main Layout

```tsx
import { MainLayout } from '@/components/layout/main-layout'

function Page() {
  return (
    <MainLayout>
      <div>Your page content</div>
    </MainLayout>
  )
}
```

### Theme-Aware Components

All UI components automatically support dark mode through CSS custom properties:

```tsx
<Card className="bg-card text-card-foreground">
  <CardHeader>
    <CardTitle>Automatically themed</CardTitle>
  </CardHeader>
</Card>
```

## 📱 Responsive Design

All authentication pages and components are fully responsive:

- Mobile-first design approach
- Flexible layouts that adapt to screen size
- Touch-friendly interaction areas
- Readable typography at all sizes

## 🚦 Getting Started

1. Copy environment variables from `.env.example`
2. Start the development server: `npm run dev`
3. Visit `http://localhost:3000`
4. Click "Sign In" and use any email/password combination
5. Explore the authenticated dashboard
6. Toggle between light/dark modes
7. Check out your profile page

## 🔧 Customization

### Adding New Auth Providers

Edit `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
providers: [
  GoogleProvider({ /* config */ }),
  GitHubProvider({ /* config */ }),
  // Add more providers
]
```

### Custom Theme Colors

Update CSS custom properties in `globals.css` and `tailwind.config.js`.

### New Protected Routes

Add route patterns to `middleware.ts` config.

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid URL" error**: Check `NEXTAUTH_URL` in `.env.local`
2. **Google OAuth not working**: Verify client ID/secret and redirect URIs
3. **Theme not persisting**: Check browser localStorage permissions
4. **Redirect loops**: Ensure middleware patterns don't conflict

### Debug Mode

Set environment variable for debugging:

```bash
NEXTAUTH_DEBUG=true
```

This provides detailed logs in the terminal.

## 🎯 Next Steps

Consider adding:

- [ ] Database persistence for user data
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] Social login with GitHub, Discord, etc.
- [ ] User preferences and settings
- [ ] Admin dashboard

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Review NextAuth.js documentation
3. Verify environment variables
4. Check network requests in dev tools

The authentication system is now fully functional with both light and dark mode support!