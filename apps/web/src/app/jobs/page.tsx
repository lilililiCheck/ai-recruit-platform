'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { jobsApi } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';

interface Job {
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
  createdAt: string;
}

export default function JobsPage() {
  const { isAuthenticated } = useAuthStore();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    category: '',
  });
  const [page, setPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    loadJobs();
  }, [page, filters.category]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      if (filters.keyword) params.keyword = filters.keyword;
      if (filters.location) params.location = filters.location;
      if (filters.category) params.category = filters.category;

      const { data } = await jobsApi.getAll(params);
      setJobs(data.jobs);
      setTotal(data.total);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadJobs();
  };

  const formatSalary = (job: Job) => {
    if (job.salaryText) return job.salaryText;
    if (job.salaryMin && job.salaryMax) {
      return `${Math.round(job.salaryMin / 1000)}K-${Math.round(job.salaryMax / 1000)}K`;
    }
    return '薪资面议';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return '今天';
    if (diff === 1) return '昨天';
    if (diff < 7) return `${diff}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  const categories = [
    { value: '', label: '全部分类' },
    { value: 'tech', label: '技术岗' },
    { value: 'non-tech', label: '非技术岗' },
    { value: 'product', label: '产品经理' },
    { value: 'operation', label: '运营' },
    { value: 'sales', label: '销售' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 搜索栏 */}
      <div className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="flex gap-4 flex-wrap">
            <input
              type="text"
              placeholder="搜索岗位、公司..."
              value={filters.keyword}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              className="flex-1 min-w-64 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="城市"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="w-40 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-40 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              搜索
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">AI岗位列表</h1>
          <span className="text-gray-600">共 {total} 个岗位</span>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-600">暂无岗位数据</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {job.companyLogo ? (
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-gray-400">
                        {job.company.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/jobs/${job.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600">
                        {job.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 mt-1">{job.company}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                      <span>{job.location || '不限'}</span>
                      <span>{formatSalary(job)}</span>
                      <span>{job.experience || '经验不限'}</span>
                      <span>{job.education || '学历不限'}</span>
                    </div>
                    {job.tags && job.tags.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {job.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-400 flex-shrink-0">
                    {formatDate(job.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 分页 */}
        {total > limit && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              上一页
            </button>
            <span className="px-4 py-2">
              第 {page} / {Math.ceil(total / limit)} 页
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= Math.ceil(total / limit)}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              下一页
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
