'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { jobsApi, favoritesApi } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';

interface Job {
  id: number;
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  company: string;
  companyLogo?: string;
  location?: string;
  salaryText?: string;
  salaryMin?: number;
  salaryMax?: number;
  experience?: string;
  education?: string;
  jobType?: string;
  category: string;
  source?: string;
  sourceUrl?: string;
  skills?: string[];
  tags?: string[];
  createdAt: string;
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const jobId = Number(params.id);

  useEffect(() => {
    loadJob();
  }, [jobId]);

  const loadJob = async () => {
    try {
      const { data } = await jobsApi.getById(jobId);
      setJob(data);

      if (isAuthenticated) {
        const favRes = await favoritesApi.getAll();
        const exists = favRes.data.some((f: any) => f.jobId === jobId);
        setIsFavorite(exists);
      }
    } catch (error) {
      console.error('Failed to load job:', error);
      router.push('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        const favRes = await favoritesApi.getAll();
        const fav = favRes.data.find((f: any) => f.jobId === jobId);
        if (fav) {
          await favoritesApi.remove(fav.id);
        }
        setIsFavorite(false);
      } else {
        await favoritesApi.add(jobId);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const formatSalary = (job: Job) => {
    if (job.salaryText) return job.salaryText;
    if (job.salaryMin && job.salaryMax) {
      return `${Math.round(job.salaryMin / 1000)}K-${Math.round(job.salaryMax / 1000)}K/月`;
    }
    return '薪资面议';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* 返回按钮 */}
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回岗位列表
        </Link>

        <div className="grid md:grid-cols-3 gap-6">
          {/* 主内容 */}
          <div className="md:col-span-2 space-y-6">
            {/* 基本信息 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {job.companyLogo ? (
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="w-14 h-14 object-contain"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-gray-400">
                      {job.company.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">{job.title}</h1>
                  <p className="text-lg text-gray-600 mt-1">{job.company}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location || '不限'}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatSalary(job)}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {job.experience || '经验不限'}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                      {job.education || '学历不限'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 技能标签 */}
              {job.skills && job.skills.length > 0 && (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 职位描述 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">职位描述</h2>
              <div className="prose max-w-none text-gray-600 whitespace-pre-wrap">
                {job.description}
              </div>
            </div>

            {/* 任职要求 */}
            {job.requirements && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">任职要求</h2>
                <div className="prose max-w-none text-gray-600 whitespace-pre-wrap">
                  {job.requirements}
                </div>
              </div>
            )}

            {/* 福利待遇 */}
            {job.benefits && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">福利待遇</h2>
                <div className="prose max-w-none text-gray-600 whitespace-pre-wrap">
                  {job.benefits}
                </div>
              </div>
            )}
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 收藏按钮 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <button
                onClick={handleFavorite}
                disabled={favoriteLoading}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  isFavorite
                    ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {favoriteLoading
                  ? '处理中...'
                  : isFavorite
                  ? '取消收藏'
                  : '收藏岗位'}
              </button>
              <p className="text-sm text-gray-500 text-center mt-2">
                {isFavorite ? '已收藏到我的岗位' : '收藏后可快速查看'}
              </p>
            </div>

            {/* 公司信息 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold mb-4">公司信息</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">公司名称</span>
                  <span className="font-medium">{job.company}</span>
                </div>
                {job.source && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">数据来源</span>
                    <span className="font-medium">{job.source}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
