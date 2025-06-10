'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  Menu,
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  HelpCircle
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import Link from 'next/link';

interface TopBarProps {
  onMenuToggle: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-neutral-200 dark:border-gray-700 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl hover:bg-neutral-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-neutral-600" />
          </button>

          {/* Search */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search transactions, categories..."
              className="input pl-10 pr-4 py-2 w-64 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Search button for mobile */}
          <button className="md:hidden p-2 rounded-xl hover:bg-neutral-100 transition-colors">
            <Search className="w-5 h-5 text-neutral-600" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl hover:bg-neutral-100 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-neutral-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-lime-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-neutral-900">3</span>
              </div>
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-strong border border-neutral-200 z-50">
                <div className="p-4 border-b border-neutral-100">
                  <h3 className="font-semibold text-neutral-900">Notifications</h3>
                </div>
                <div className="p-2 space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                  {[1, 2, 3].map((notification) => (
                    <div
                      key={notification}
                      className="p-3 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer"
                    >
                      <p className="text-sm font-medium text-neutral-900">
                        Budget limit exceeded
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        Your dining budget has exceeded 80% of the limit
                      </p>
                      <p className="text-xs text-neutral-400 mt-1">2 hours ago</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-neutral-100">
                  <button className="text-sm text-lime-600 hover:text-lime-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-xl hover:bg-neutral-100 transition-colors"
            >
              <div className="w-8 h-8 bg-lime-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-neutral-900" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-neutral-900">
                  {session?.user?.name || 'User'}
                </p>
                <p className="text-xs text-neutral-500">
                  {session?.user?.email || 'No email'}
                </p>
              </div>
            </button>

            {/* User dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-strong border border-neutral-200 z-50">
                <div className="p-3 border-b border-neutral-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-lime-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-neutral-900" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">
                        {session?.user?.name || 'User'}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {session?.user?.email || 'No email'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2 space-y-1">
                  <Link href="/profile" className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors text-left">
                    <User className="w-4 h-4 text-neutral-600" />
                    <span className="text-sm text-neutral-700">Profile</span>
                  </Link>
                  <Link href="/settings" className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors text-left">
                    <Settings className="w-4 h-4 text-neutral-600" />
                    <span className="text-sm text-neutral-700">Settings</span>
                  </Link>
                  <button className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors text-left">
                    <HelpCircle className="w-4 h-4 text-neutral-600" />
                    <span className="text-sm text-neutral-700">Help & Support</span>
                  </button>
                </div>

                <div className="p-2 border-t border-neutral-100">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 transition-colors text-left group"
                  >
                    <LogOut className="w-4 h-4 text-neutral-600 group-hover:text-red-600" />
                    <span className="text-sm text-neutral-700 group-hover:text-red-600">Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Close dropdowns when clicking outside */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
}