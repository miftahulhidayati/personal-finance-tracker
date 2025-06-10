'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { User, Mail, Calendar } from 'lucide-react'

export default function ProfilePage() {
	const { data: session, status } = useSession()
	const [isEditing, setIsEditing] = useState(false)
	const [formData, setFormData] = useState({
		name: session?.user?.name || '',
		email: session?.user?.email || ''
	})

	if (status === 'loading') {
		return (
			<div className="container mx-auto py-6">
				<div className="animate-pulse">
					<div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
					<div className="h-32 bg-gray-200 rounded mb-4"></div>
				</div>
			</div>
		)
	}

	if (!session) {
		return (
			<div className="container mx-auto py-6">
				<Card>
					<CardContent className="text-center py-6">
						<p>Please sign in to view your profile.</p>
					</CardContent>
				</Card>
			</div>
		)
	}

	const initials = session.user.name
		?.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase() || session.user.email?.[0]?.toUpperCase() || 'U'

	const handleSave = () => {
		// In a real app, you would save to your backend here
		console.log('Saving profile data:', formData)
		setIsEditing(false)
	}

	return (
		<div className="container mx-auto py-6 space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Profile</h1>
				<ThemeToggle />
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				{/* Profile Information */}
				<Card>
					<CardHeader>
						<CardTitle>Profile Information</CardTitle>
						<CardDescription>
							Manage your account details and preferences
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="flex items-center space-x-4">
							<Avatar className="h-20 w-20">
								<AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
								<AvatarFallback className="text-lg">{initials}</AvatarFallback>
							</Avatar>
							<div>
								<h2 className="text-xl font-semibold">{session.user.name || 'User'}</h2>
								<p className="text-muted-foreground">{session.user.email}</p>
							</div>
						</div>

						<Separator />

						<div className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Label htmlFor="name">Name</Label>
									{isEditing ? (
										<Input
											id="name"
											value={formData.name}
											onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
										/>
									) : (
										<div className="flex items-center space-x-2 p-2">
											<User className="h-4 w-4 text-muted-foreground" />
											<span>{session.user.name || 'Not set'}</span>
										</div>
									)}
								</div>
								<div>
									<Label htmlFor="email">Email</Label>
									{isEditing ? (
										<Input
											id="email"
											type="email"
											value={formData.email}
											onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
										/>
									) : (
										<div className="flex items-center space-x-2 p-2">
											<Mail className="h-4 w-4 text-muted-foreground" />
											<span>{session.user.email}</span>
										</div>
									)}
								</div>
							</div>

							<div className="flex space-x-2">
								{isEditing ? (
									<>
										<Button onClick={handleSave}>Save Changes</Button>
										<Button variant="outline" onClick={() => setIsEditing(false)}>
											Cancel
										</Button>
									</>
								) : (
									<Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
								)}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Account Settings */}
				<Card>
					<CardHeader>
						<CardTitle>Account Settings</CardTitle>
						<CardDescription>
							Configure your account preferences
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-4">
							<div>
								<Label>Theme Preference</Label>
								<div className="flex items-center justify-between mt-2">
									<span className="text-sm text-muted-foreground">
										Choose your preferred theme
									</span>
									<ThemeToggle />
								</div>
							</div>

							<Separator />

							<div className="space-y-3">
								<Label>Account Information</Label>
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-sm">Account ID</span>
										<span className="text-sm font-mono bg-muted px-2 py-1 rounded">
											{session.user.id}
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="text-sm">Member since</span>
										<span className="text-sm text-muted-foreground">
											<Calendar className="inline h-4 w-4 mr-1" />
											{new Date().toLocaleDateString()}
										</span>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
