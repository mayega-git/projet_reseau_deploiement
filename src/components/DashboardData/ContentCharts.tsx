'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#26b03e', '#A0A0A0', '#FF4D4D', '#FF8042'];

interface StatusData {
  name: string; // Example: "Published", "Draft", "Pending"
  value: number; // Number of items in that status
}

// Define the structure for the Monthly Blog and Podcast Trend Data
interface TrendData {
  month: string; // Example: "January", "February"
  Blogs?: number; // Number of blogs created in that month (optional for flexibility)
  Podcasts?: number; // Number of podcasts created in that month (optional for flexibility)
}

interface BlogAndPodcastChartsProps {
  blogStatusData: StatusData[];
  podcastStatusData: StatusData[];
  blogTrendData: TrendData[];
  podcastTrendData: TrendData[];
}

const ContentCharts: React.FC<BlogAndPodcastChartsProps> = ({
  blogStatusData,
  podcastStatusData,
  blogTrendData,
  podcastTrendData,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Blog Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="h6-medium">Blog Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={blogStatusData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
              >
                {blogStatusData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Podcast Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="h6-medium">
            Podcast Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={podcastStatusData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                fill="#82ca9d"
              >
                {podcastStatusData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Blog Creation Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Blog Creation Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={blogTrendData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Blogs" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Podcast Creation Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Podcast Creation Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={podcastTrendData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Podcasts" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentCharts;
