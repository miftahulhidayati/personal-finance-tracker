import { withAuth } from 'next-auth/middleware'

export default withAuth(
	function middleware(req) {
		// Add any additional middleware logic here if needed
	},
	{
		callbacks: {
			authorized: ({ token, req }) => {
				// Protect dashboard and profile routes
				if (req.nextUrl.pathname.startsWith('/dashboard') ||
				    req.nextUrl.pathname.startsWith('/profile') ||
				    req.nextUrl.pathname.startsWith('/budgeting') ||
				    req.nextUrl.pathname.startsWith('/spending') ||
				    req.nextUrl.pathname.startsWith('/analytics')) {
					return !!token
				}
				return true
			},
		},
	}
)

export const config = {
	matcher: ['/dashboard/:path*', '/profile/:path*', '/budgeting/:path*', '/spending/:path*', '/analytics/:path*']
}