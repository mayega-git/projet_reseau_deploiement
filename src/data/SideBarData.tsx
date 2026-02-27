/* eslint-disable @typescript-eslint/no-unused-vars */
import Home from '@/app/page';
import { AppRoles } from '@/constants/roles';
import {
  LayoutDashboard,
  Sparkles,
  Mic,
  Tag,
  Folder,
  BookOpen,
  Heart,
  Shield,
  ChartNoAxesColumn,
  Book,
  Star,
  LogOut,
  User,
  PencilLine,
  Building2,
  Mail,
  MessageCircle,
  HomeIcon,
} from 'lucide-react';
import App from 'next/app';
import React, { FunctionComponent } from 'react';

interface SubNavInterface {
  title: string;
  role: string[];
  url: string;
}
interface SideBarDataInterface {
  title: string;
  url: string;
  role: string[];
  icon: FunctionComponent; // Icon component
  subnav: SubNavInterface[];
}
export const SideBarData = [

  {
    title: 'Accueil',
    url: `/`,
    role: [
      AppRoles.SUPER_ADMIN,
      AppRoles.AUTHOR,
      AppRoles.PENDING_ORGANISATION,
      AppRoles.ADMIN,
      AppRoles.USER],
    icon: HomeIcon,
    subnav: [],
  },
  {
    title: 'Dashboard',
    url: `/u/dashboard`,
    role: [AppRoles.SUPER_ADMIN, AppRoles.AUTHOR, AppRoles.PENDING_ORGANISATION, AppRoles.ADMIN],
    icon: LayoutDashboard,
    subnav: [],
  },
  {
    title: 'Feed',
    url: `/u/feed/blog`,
    role: [
      AppRoles.SUPER_ADMIN,
      AppRoles.AUTHOR,
      AppRoles.PENDING_ORGANISATION,
      AppRoles.ADMIN,
      AppRoles.USER,
    ],
    icon: Sparkles,
    subnav: [],
  },
  {
    title: 'Favorites',
    url: `/u/favorites/blog`,
    role: [
      AppRoles.SUPER_ADMIN,
      AppRoles.AUTHOR,
      AppRoles.PENDING_ORGANISATION,
      AppRoles.ADMIN,
      AppRoles.USER,
    ],
    icon: Heart,
    subnav: [],
  },

  // {
  //   title: 'Blogs',
  //   url: `/u/blogs`,
  //   role: [admin, user],
  //   icon: BookOpen,
  //   subnav: [],
  // },
  // {
  //   title: 'Podcasts',
  //   url: `/u/podcast`,
  //   role: [admin, user],
  //   icon: Mic,
  //   subnav: [],
  // },
  {
    title: 'Manage Blogs',
    url: '/u/manage/blogs',
    role: [AppRoles.SUPER_ADMIN],
    icon: BookOpen,
    subnav: [],
  },
  {
    title: 'Manage Podcasts',
    url: '/u/manage/podcasts',
    role: [AppRoles.SUPER_ADMIN],
    icon: Mic,
    subnav: [],
  },
  {
    title: 'My Organisation',
    url: '/u/organisations',
    role: [AppRoles.ADMIN],
    icon: Building2,
    subnav: [],
  },
  {
    title: 'My Authors',
    url: `/u/authors`,
    role: [AppRoles.ADMIN],
    icon: PencilLine,
    subnav: [],
  },
  {
    title: 'Tags',
    url: '/',
    role: [
      AppRoles.SUPER_ADMIN,
      AppRoles.AUTHOR,
      AppRoles.PENDING_ORGANISATION,
      AppRoles.ADMIN,
    ],
    icon: Tag,
    subnav: [
      {
        title: 'Tags',
        role: [
          AppRoles.SUPER_ADMIN,
          AppRoles.AUTHOR,
          AppRoles.PENDING_ORGANISATION,
          AppRoles.ADMIN,
        ],
        url: `/u/tags`,
      },
      {
        title: 'Manage Tags',
        role: [AppRoles.SUPER_ADMIN],
        url: `/u/tags/manage`,
      },
    ],
  },
  {
    title: 'Categories',
    url: '/',
    role: [
      AppRoles.SUPER_ADMIN,
      AppRoles.AUTHOR,
      AppRoles.PENDING_ORGANISATION,
      AppRoles.ADMIN,
    ],
    icon: Folder,
    subnav: [
      {
        title: 'Categories',
        role: [
          AppRoles.SUPER_ADMIN,
          AppRoles.AUTHOR,
          AppRoles.PENDING_ORGANISATION,
          AppRoles.ADMIN,
        ],
        url: `/u/category`,
      },
      {
        title: 'Manage Categories',
        role: [AppRoles.SUPER_ADMIN],
        url: `/u/category/manage`,
      },
    ],
  },
  {
    title: 'Manage Roles',
    url: `/u/roles`,
    role: [AppRoles.SUPER_ADMIN],
    icon: Shield,
    subnav: [],
  },
  {
    title: 'Forum',
    url: `/u/forum`,
    role: [AppRoles.SUPER_ADMIN, AppRoles.AUTHOR, AppRoles.PENDING_ORGANISATION, AppRoles.USER],
    icon: MessageCircle,
    subnav: [],
  },
  {
    title: 'Manage NewsLetter',
    url: `/u/manage/newsletter`,
    role: [AppRoles.SUPER_ADMIN],
    icon: Mail,
    subnav: [{
      title: 'Redacteurs',
      url: `/u/manage/newsletter/redacteurs`,
      role: [AppRoles.SUPER_ADMIN, AppRoles.ADMIN],
      icon: Mail,
      subnav: [],


  },
  {
    title: 'Newsletter Categories',
    url: `/u/newsletter/categories/manage`,
    role: [AppRoles.SUPER_ADMIN, AppRoles.ADMIN],
    icon: Mail,
    subnav: [],
  },
  {
    title: 'NewsLetter',
    url: `/u/newsletter`,
    role: [AppRoles.AUTHOR, AppRoles.PENDING_ORGANISATION],
    icon: Mail,
    subnav: [],
  }],
  },
  {
    title: 'Education',
    url: ``,
    role: [AppRoles.AUTHOR, AppRoles.USER,AppRoles.ADMIN,AppRoles.SUPER_ADMIN,AppRoles.PENDING_ORGANISATION,AppRoles.ORGANISATION],
    icon: Mail,
    subnav: [
      {
        title: 'Blogs',
        url: `/blog/create`,
        role: [AppRoles.AUTHOR, AppRoles.PENDING_ORGANISATION],
        icon: Mail,
        subnav: [],
      },
      {
        title: 'Courses',
        url: `/course/create`,
        role: [AppRoles.AUTHOR, AppRoles.USER,AppRoles.ADMIN,AppRoles.SUPER_ADMIN,AppRoles.PENDING_ORGANISATION,AppRoles.ORGANISATION],
        icon: Mail,
        subnav: [],
      },
    ],
  }
  ,

  // {
  //   title: 'Analytics',
  //   url: `/u/${user}/analytics`,
  //   role: [user],
  //   icon: LayoutDashboard,
  //   subnav: [],
  // },
];

export default SideBarData;
