'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { favoritesApi } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';

interface FavoriteJob {
  id: number;
  jobId: number;
  createdAt: string;
  job: {
    id: number;
    title: string;
    company: string;
    companyLogo?: string;
    location?: string;
    salaryText?: string;
    salaryMin?: number;
    salaryMax?: number;
    experience?: string;
    education?: string;
    category: string;
    tags?: string[];
  };
}

export default function FavoritesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [favorites, setFavorites] = useState<FavoriteJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadFavorites();
  }, [isAuthenticated, router]);

  const loadFavorites = async () => {
    try {
      const { data } = await favoritesApi.getAll();
      setFavorites(data);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: number) => {
    setRemoving(id);
    try {
      await favoritesApi.remove(id);
      setFavorites(favorites.filter((f) => f.id !== id));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    } finally {
      setRemoving(null);
    }
  };

  const formatSalary = (job: FavoriteJob['job']) => {
    if (job.salaryText) return job.salaryText;
    if (job.salaryMin && job.salaryMax) {
      return `${Math.round(job.salaryMin / 1000)}K-${Math.round(job.salaryMax / 1000)}K`;
    }
    return '薪资面议';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">我的收藏</h1>
          <Link
            href="/jobs"
            className="text-primary-600 hover:underline"
          >
            浏览更多岗位
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <div className="text-6xl mb-4">📁</div>
            <p className="text-gray-600 mb-4">暂无收藏岗位</p>
            <Link
              href="/jobs"
              className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              去浏览岗位
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((fav) => (
              <div
                key={fav.id}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {fav.job.companyLogo ? (
                      <img
                        src={fav.job.companyLogo}
                        alt={fav.job.company}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-gray-400">
                        {fav.job.company.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/jobs/${fav.job.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600">
                        {fav.job.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 mt-1">{fav.job.company}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                      <span>{fav.job.location || '不限'}</span>
                      <span>{formatSalary(fav.job)}</span>
                      <span>{fav.job.experience || '经验不限'}</span>
                      <span>{fav.job.education || '学历不限'}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => handleRemove(fav.id)}
                      disabled={removing === fav.id}
                      className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                    >
                      {removing === fav.id ? (
                        <span className="text-sm">删除中...</span>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                    <span className="text-xs text-gray-400">
                      收藏于 {formatDate(fav.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
