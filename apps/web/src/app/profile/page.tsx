'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { userApi, favoritesApi, subscriptionsApi } from '@/lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [subscriptionsCount, setSubscriptionsCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // 获取收藏数量
    favoritesApi.getAll().then((res) => {
      setFavoritesCount(res.data.length);
    });

    // 获取订阅数量
    subscriptionsApi.getAll().then((res) => {
      setSubscriptionsCount(res.data.length);
    });
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
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
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user.name}</span>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              退出
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* 侧边栏 */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-primary-600">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>

              <div className="mt-6 space-y-3">
                <Link
                  href="/profile"
                  className="block py-2 px-4 bg-primary-50 text-primary-600 rounded-lg"
                >
                  个人中心
                </Link>
                <Link
                  href="/favorites"
                  className="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  我的收藏 ({favoritesCount})
                </Link>
                <Link
                  href="/subscriptions"
                  className="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  订阅管理 ({subscriptionsCount})
                </Link>
              </div>
            </div>
          </div>

          {/* 主内容 */}
          <div className="md:col-span-2 space-y-6">
            {/* 统计卡片 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-3xl font-bold text-primary-600">
                  {favoritesCount}
                </div>
                <div className="text-gray-600 mt-1">收藏岗位</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-3xl font-bold text-primary-600">
                  {subscriptionsCount}
                </div>
                <div className="text-gray-600 mt-1">订阅岗位</div>
              </div>
            </div>

            {/* 快捷操作 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">快捷操作</h3>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/jobs"
                  className="py-4 px-6 border rounded-xl text-center hover:border-primary-500 hover:text-primary-600 transition-colors"
                >
                  <div className="text-xl mb-1">🔍</div>
                  <div>浏览岗位</div>
                </Link>
                <Link
                  href="/subscriptions/create"
                  className="py-4 px-6 border rounded-xl text-center hover:border-primary-500 hover:text-primary-600 transition-colors"
                >
                  <div className="text-xl mb-1">🔔</div>
                  <div>创建订阅</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
