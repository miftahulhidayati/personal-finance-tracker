import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' }
			},
			async authorize(credentials) {
				// For demo purposes, we'll accept any email/password combination
				// In production, you'd verify against your database
				if (credentials?.email && credentials?.password) {
					return {
						id: 'demo-user',
						email: credentials.email,
						name: 'Demo User',
						image: null,
					}
				}
				return null
			}
		})
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id
			}
			return token
		},
		async session({ session, token }) {
			if (token && session.user) {
				session.user.id = token.id as string
			}
			return session
		}
	},
	pages: {
		signIn: '/auth/signin',
		error: '/auth/error',
	},
	session: {
		strategy: 'jwt',
	},
}