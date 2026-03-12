'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold text-primary-600">
            AI Jobs
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/jobs" className="text-gray-600 hover:text-gray-900">
              岗位搜索
            </Link>
            <Link href="/recommend" className="text-gray-600 hover:text-gray-900">
              智能推荐
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="text-gray-600 hover:text-gray-900"
              >
                {user?.name}
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                退出
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                注册
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
