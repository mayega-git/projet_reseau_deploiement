/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { Archive, CheckCircle, XCircle } from 'lucide-react';
import {
  getAllBlogs,
  getAllBlogsEverCreated,
  getAllPodcasts,
  getAllPodcastsEverCreated,
} from '@/actions/blog';
import SideBarHeader from '@/components/Header/SideBarHeader';
import SidebarPageHeading from '@/components/ui/SidebarPageHeading';

import { BlogInterface } from '@/types/blog';
import { PodcastInterface } from '@/types/podcast';
import ContentCharts from '@/components/DashboardData/ContentCharts';
import { useAuth } from '@/context/AuthContext';
import { AppRoles } from '@/constants/roles';

interface StatusDataInterface {
  name: string;
  value: number;
}
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
interface BlogTrendDataInterface {
  month: string;
  Blogs: number;
}

interface PodcastTrendDataInterface {
  month: string;
  Podcasts: number;
}

const Dashboard = () => {
  const { role } = useAuth();
  const [archivedCount, setArchivedCount] = useState<BlogInterface[] | null>(
    null
  );
  const [publishedCount, setPublishedCount] = useState<BlogInterface[] | null>(
    null
  );
  const [refusedCount, setRefusedCount] = useState<BlogInterface[] | null>(
    null
  );
  const [totalBlogs, setTotalBlogs] = useState<BlogInterface[] | null>(null);

  const [archivedCountPod, setArchivedCountPod] = useState<
    PodcastInterface[] | null
  >(null);
  const [publishedCountPod, setPublishedCountPod] = useState<
    PodcastInterface[] | null
  >(null);
  const [refusedCountPod, setRefusedCountPod] = useState<
    PodcastInterface[] | null
  >(null);
  const [totalPodcasts, setTotalPodcasts] = useState<PodcastInterface[] | null>(
    null
  );

  const [blogStatusData, setBlogStatusData] = useState<StatusDataInterface[]>(
    []
  );
  const [podcastStatusData, setPodcastStatusData] = useState<
    StatusDataInterface[]
  >([]);
  const [blogTrendData, setBlogTrendData] = useState<BlogTrendDataInterface[]>(
    []
  );
  const [podcastTrendData, setPodcastTrendData] = useState<
    PodcastTrendDataInterface[]
  >([]);

  const fetchData = async () => {
    // fetch all the data for superadmin
    if (role && role.includes(AppRoles.SUPER_ADMIN)) {
      const archived = await getAllBlogs('ARCHIVED');
      const published = await getAllBlogs('PUBLISHED');
      const refused = await getAllBlogs('REFUSED');
      const total = await getAllBlogsEverCreated();

      const archivedPod = await getAllPodcasts('ARCHIVED');
      const publishedPod = await getAllPodcasts('PUBLISHED');
      const refusedPod = await getAllPodcasts('REFUSED');
      const totalPod = await getAllPodcastsEverCreated();

      setArchivedCount(archived);
      setPublishedCount(published);
      setRefusedCount(refused);
      setTotalBlogs(total);

      setArchivedCountPod(archivedPod);
      setPublishedCountPod(publishedPod);
      setRefusedCountPod(refusedPod);
      setTotalPodcasts(totalPod);

      // Data for Blog Status Distribution Chart
      setBlogStatusData([
        { name: 'Published', value: published.length },
        { name: 'Archived', value: archived.length },
        { name: 'Refused', value: refused.length },
      ]);

      // Data for Podcast Status Distribution Chart
      setPodcastStatusData([
        { name: 'Published', value: publishedPod.length },
        { name: 'Archived', value: archivedPod.length },
        { name: 'Refused', value: refusedPod.length },
      ]);

      // Monthly Creation Trends for Blogs
      const monthlyBlogCreation = total.reduce(
        (acc: { [key: string]: number }, blog: BlogInterface) => {
          const date = new Date(blog.createdAt);
          const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
          acc[monthYear] = (acc[monthYear] || 0) + 1;
          return acc;
        },
        {}
      );

      setBlogTrendData(
        Object.entries(monthlyBlogCreation).map(([monthYear, count]) => ({
          month: monthYear,
          Blogs: count,
        }))
      );

      // Monthly Creation Trends for Podcasts
      const monthlyPodcastCreation = totalPod.reduce(
        (acc: { [key: string]: number }, podcast: PodcastInterface) => {
          const date = new Date(podcast.createdAt);
          const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
          acc[monthYear] = (acc[monthYear] || 0) + 1;
          return acc;
        },
        {}
      );

      setPodcastTrendData(
        Object.entries(monthlyPodcastCreation).map(([monthYear, count]) => ({
          month: monthYear,
          Podcasts: count,
        }))
      );
    } else if (role && role.includes(AppRoles.ADMIN)) {
      // Fetch filtered data for admin
    } else if (role && (role.includes(AppRoles.AUTHOR) || role.includes(AppRoles.PENDING_ORGANISATION))) {
      // Fetch filtered data for author
    }
  };

  useEffect(() => {
    if (role) {
      fetchData();
    }
  }, [role]);

  const getPercentage = (count: number) =>
    totalBlogs?.length ? ((count / totalBlogs.length) * 100).toFixed(1) : '0';

  const getPodcastPercentage = (count: number) =>
    totalPodcasts?.length
      ? ((count / totalPodcasts.length) * 100).toFixed(1)
      : '0';

  const createStatData = (
    count: number,
    type: 'Blog' | 'Podcast',
    title: string
  ) => ({
    title,
    count,
    percentage:
      type === 'Blog' ? getPercentage(count) : getPodcastPercentage(count),
    icon: title.includes('Published') ? (
      <CheckCircle className="w-8 h-8 text-green-600" />
    ) : title.includes('Archived') ? (
      <Archive className="w-8 h-8 text-gray-400" />
    ) : (
      <XCircle className="w-8 h-8 text-red-600" />
    ),
    bgColor: title.includes('Published')
      ? 'bg-green-100'
      : title.includes('Refused')
      ? 'bg-red-100'
      : 'bg-gray-100',
  });

  const statsBlogs = [
    createStatData(publishedCount?.length ?? 0, 'Blog', 'Published Blogs'),
    createStatData(archivedCount?.length ?? 0, 'Blog', 'Archived Blogs'),
    createStatData(refusedCount?.length ?? 0, 'Blog', 'Refused Blogs'),
  ];

  const statsPodcasts = [
    createStatData(
      publishedCountPod?.length ?? 0,
      'Podcast',
      'Published Podcasts'
    ),
    createStatData(
      archivedCountPod?.length ?? 0,
      'Podcast',
      'Archived Podcasts'
    ),
    createStatData(refusedCountPod?.length ?? 0, 'Podcast', 'Refused Podcasts'),
  ];

  return (
    <div className="flex flex-col gap-8">
      <SidebarPageHeading title="Dashboard" />

      <div className="flex flex-col gap-3 h6-bold">
        <p className="h6-medium">Blogs</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {statsBlogs.map((stat, index) => (
            <div
              key={index}
              className="border border-grey-300 w-full flex items-start p-6 rounded-[8px] gap-3 transition-all"
            >
              <div>{stat.icon}</div>
              <div className="flex w-full flex-col gap-2">
                <p>{stat.title}</p>
                <div className="flex w-full justify-between items-center">
                  <p className="h4-bold font-bold">{stat.count}</p>
                  <p className="paragraph-small-normal text-black-300">
                    {stat.percentage}% of total
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 h6-bold">
        <p className="h6-medium">Podcasts</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {statsPodcasts.map((stat, index) => (
            <div
              key={index}
              className="border border-grey-300 w-full flex items-start p-6 rounded-[8px] gap-3 transition-all"
            >
              <div>{stat.icon}</div>
              <div className="flex w-full flex-col gap-2">
                <p>{stat.title}</p>
                <div className="flex w-full justify-between items-center">
                  <p className="h4-bold font-bold">{stat.count}</p>
                  <p className="paragraph-small-normal text-black-300">
                    {stat.percentage}% of total
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ContentCharts
        blogStatusData={blogStatusData}
        podcastStatusData={podcastStatusData}
        blogTrendData={blogTrendData}
        podcastTrendData={podcastTrendData}
      />

      {/* 
      <DashboardData /> */}
    </div>
  );
};

export default Dashboard;
