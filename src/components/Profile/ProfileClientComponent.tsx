/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'; // Mark this as a Client Component

import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/helper/getInitials';
import Image from 'next/image';
import StatusTag from '../ui/StatusTag';
import { GetUser } from '@/types/User';
import { BlogInterface } from '@/types/blog';
import { PodcastInterface } from '@/types/podcast';
import HeaderWrapper from '../Header/HeaderWrapper';
import { formatDateOrRelative } from '@/helper/formatDateOrRelative';
import {
  followUser,
  isFollowing as checkIsFollowing,
  unfollowUser,
} from '@/actions/user';
import { useAuth } from '@/context/AuthContext';
import TextArea from '../ui/textarea';
import UserAvatar from '../UserAvatar';
import { User } from 'lucide-react';
import { truncateText, truncateTitleText } from '@/helper/TruncateText';
import Link from 'next/link';
import LikeDislikeButton from '../ui/LikeDislikeButton';
import { entityType } from '@/constants/entityType';
import CommentsButton from '../ui/CommentsButton';
import ViewsButton from '../ui/ViewsButton';
import ShareButtons from '../ui/ShareButtons';
import ShareButton2 from '../ui/ShareButton';
import BlogProfileCard from '../Blog/BlogProfileCard';
import PodcastProfileCard from '../Podcast/PodcastProfileCard';
import BlogCard from '../Blog/blogCard';
import PodcastCard from '../Podcast/podcastCard';
import { AppRoles } from '@/constants/roles';
import UpdateUserForm from '../AuthForms/UpdateUserForm';
import OrganisationMembers from '../Organisation/OrganisationMembers';

interface ProfileClientComponentProps {
  userData: GetUser;
  blogData: BlogInterface[];
  podcastData: PodcastInterface[];
  totalPosts: number;
  followers: GetUser[];
  following: GetUser[];
}

export default function ProfileClientComponent({
  userData,
  blogData,
  podcastData,
  totalPosts,
  followers,
  following,
}: ProfileClientComponentProps) {
  const [activeTab, setActiveTab] = useState<
    'blog' | 'podcast' | 'course' | 'followers' | 'following' | 'edit' | 'members'
  >('blog');
  const [openDropdown, setOpenDropdown] = useState<'post' | 'follow' | null>(null);
  const postDropdownRef = useRef<HTMLDivElement>(null);
  const followDropdownRef = useRef<HTMLDivElement>(null);

  const [isFollowing, setIsFollowing] = useState(false);
  const userBio = userData?.bio || 'Software Engineer | Open Source Enthusiast | Cat Lover';

  //get current loggedIn user
  const { user, role } = useAuth();

  // Check if the logged-in user is viewing their own profile
  const isCurrentUserProfile = user?.id === userData.id;

  const handleFollowUserInline = async () => {
    const action = isFollowing ? 'unfollow' : 'follow';
    if (action === 'follow' && user?.id) {
      await followUser(
        user?.id,
        userData.id
      );
      window.location.reload();
    } else if (action === 'unfollow' && user?.id) {
      await unfollowUser(
        user?.id,
        userData.id
      );
      window.location.reload();
    }
  };
  const checkFollowingStatus = async () => {
    if (user?.id && userData?.id) {
      const isFollowingValue = await checkIsFollowing(user.id, userData?.id);
      setIsFollowing(isFollowingValue);
    }
  };

  useEffect(() => {
    checkFollowingStatus();
  }, [user?.id, userData?.id]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        postDropdownRef.current && !postDropdownRef.current.contains(event.target as Node) &&
        followDropdownRef.current && !followDropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isPostTab = activeTab === 'blog' || activeTab === 'podcast' || activeTab === 'course';
  const isFollowTab = activeTab === 'followers' || activeTab === 'following';

  return (
    <>
      <HeaderWrapper />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-4">
              {/* Avatar */}
              {userData && (
                <UserAvatar
                  userId={userData.id}
                  fullName={userData.firstName + ' ' + userData.lastName}
                  size="lg"
                />
              )}

              {/* User Info */}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {userData.firstName + ' ' + userData.lastName}
                  </h1>

                  {user?.id !== userData.id &&
                    !(
                      role?.includes(AppRoles.SUPER_ADMIN) ||
                      role?.includes(AppRoles.ADMIN)
                    ) && (
                      <>
                        <p>·</p>
                        <Button onClick={handleFollowUserInline} size={'sm'}>
                          {isFollowing ? 'Unfollow' : 'Follow'}
                        </Button>
                      </>
                    )}
                </div>
                <p className="text-black-500">{userData?.email}</p>
                <p className="text-gray-700 mt-2">
                  {userBio}
                </p>
                <div className="flex space-x-4 mt-4">
                  <p className="text-black-500">
                    <span className="font-bold">
                      {followers && followers.length ? followers.length : 0}
                    </span>{' '}
                    Followers
                  </p>
                  <p className="text-black-500">
                    <span className="font-bold">
                      {' '}
                      {following && following.length ? following.length : 0}
                    </span>{' '}
                    Following
                  </p>
                  <p className="text-black-500">
                    <span className="font-bold">{totalPosts}</span> Posts
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8">
            <nav className="flex space-x-4 border-b border-gray-200">
              {/* Post Dropdown */}
              <div className="relative" ref={postDropdownRef}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'post' ? null : 'post')}
                  className={`px-4 py-2 text-sm font-medium ${
                    isPostTab
                      ? 'text-primaryPurple-500 border-b-2 border-primaryPurple-500'
                      : 'text-gray-500 hover:text-primaryPurple-500'
                  }`}
                >
                  Post ▾
                </button>
                {openDropdown === 'post' && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[150px]">
                    <ul className="py-1">
                      <li>
                        <button
                          onClick={() => { setActiveTab('blog'); setOpenDropdown(null); }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                            activeTab === 'blog' ? 'text-primaryPurple-500 font-medium' : 'text-gray-700'
                          }`}
                        >
                          Blog
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => { setActiveTab('podcast'); setOpenDropdown(null); }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                            activeTab === 'podcast' ? 'text-primaryPurple-500 font-medium' : 'text-gray-700'
                          }`}
                        >
                          Podcast
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => { setActiveTab('course'); setOpenDropdown(null); }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                            activeTab === 'course' ? 'text-primaryPurple-500 font-medium' : 'text-gray-700'
                          }`}
                        >
                          Course
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Follow Dropdown */}
              <div className="relative" ref={followDropdownRef}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'follow' ? null : 'follow')}
                  className={`px-4 py-2 text-sm font-medium ${
                    isFollowTab
                      ? 'text-primaryPurple-500 border-b-2 border-primaryPurple-500'
                      : 'text-gray-500 hover:text-primaryPurple-500'
                  }`}
                >
                  Follow ▾
                </button>
                {openDropdown === 'follow' && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[150px]">
                    <ul className="py-1">
                      <li>
                        <button
                          onClick={() => { setActiveTab('followers'); setOpenDropdown(null); }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                            activeTab === 'followers' ? 'text-primaryPurple-500 font-medium' : 'text-gray-700'
                          }`}
                        >
                          Followers
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => { setActiveTab('following'); setOpenDropdown(null); }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                            activeTab === 'following' ? 'text-primaryPurple-500 font-medium' : 'text-gray-700'
                          }`}
                        >
                          Following
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Members Tab (Only for Organisation Role) */}
              {userData?.roles?.includes(AppRoles.ORGANISATION) && (
                <button
                  onClick={() => { setActiveTab('members'); setOpenDropdown(null); }}
                  className={`px-4 py-2 text-sm font-medium border-b-2 ${
                    activeTab === 'members'
                      ? 'text-primaryPurple-500 border-primaryPurple-500'
                      : 'text-gray-500 border-transparent hover:text-primaryPurple-500'
                  }`}
                >
                  Members
                </button>
              )}

              {/* Conditionally render the Edit Profile tab */}
              {isCurrentUserProfile && (
                <button
                  onClick={() => { setActiveTab('edit'); setOpenDropdown(null); }}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'edit'
                      ? 'text-primaryPurple-500 border-b-2 border-primaryPurple-500'
                      : 'text-gray-500 hover:text-primaryPurple-500'
                  }`}
                >
                  Edit Profile
                </button>
              )}
            </nav>

            {/* Tab Content */}
            <div className="mt-6 flex flex-col ">
              {/* Blog */}
              {activeTab === 'blog' && (
                <BlogProfileCard post={blogData} userData={userData} />
              )}

              {/* Podcast */}
              {activeTab === 'podcast' && (
                <PodcastProfileCard post={podcastData} userData={userData} />
              )}

              {/* Course */}
              {activeTab === 'course' && (
                <div className="flex flex-col items-center gap-3 mt-24">
                  <p className="paragraph-medium-normal font-normal text-black-300">
                    No courses yet!
                  </p>
                </div>
              )}

              {activeTab === 'followers' && (
                <div className="space-y-4">
                  {followers && followers.length > 0 ? (
                    followers.map((follower) => (
                      <div
                        key={follower.id}
                        className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4"
                      >
                        <Link href={`profile/${follower.id}`}>
                          <UserAvatar
                            userId={follower.id}
                            fullName={
                              userData.firstName + '' + userData.lastName
                            }
                          />
                        </Link>
                        <div>
                          <p className="paragraph-medium-medium text-black-500">
                            {userData.firstName + '' + userData.lastName}
                          </p>
                          <p className="text-black-300">{follower.email}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center gap-3 mt-24">
                      <p className="paragraph-medium-normal font-normal text-black-300">
                        No followers yet!
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'following' && (
                <div className="space-y-4">
                  {following && following.length > 0 ? (
                    following.map((followed) => (
                      <div
                        key={followed.id}
                        className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center w-full"
                      >
                        <div className="flex items-center space-x-4">
                          <Link href={`profile/${followed.id}`}>
                            <UserAvatar
                              userId={followed.id}
                              fullName={
                                userData.firstName + '' + userData.lastName
                              }
                            />
                          </Link>
                          <div>
                            <p className="paragraph-medium-medium text-black-500">
                              {userData.firstName + '' + userData.lastName}
                            </p>
                            <p className="text-gray-600">{followed.email}</p>
                          </div>
                        </div>
                        {/* <Button
                          onClick={() =>
                            handleUnfollowUserInline(
                              followed.id,
                              followed.fullName
                            )
                          }
                          variant={'outline'}
                          size={'sm'}
                        >
                          Unfollow
                        </Button> */}
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center gap-3 mt-24">
                      <p className="paragraph-medium-normal font-normal text-black-300">
                        No following yet!
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Members Content */}
              {activeTab === 'members' && userData?.roles?.includes(AppRoles.ORGANISATION) && (
                <OrganisationMembers
                  orgId={userData.id}
                  isOwner={isCurrentUserProfile || role?.includes(AppRoles.SUPER_ADMIN) || role?.includes(AppRoles.ADMIN) || false}
                />
              )}

              {/* Conditionally render the Edit Profile page */}
              {isCurrentUserProfile &&
                activeTab === 'edit' &&
                role &&
                !role.includes(AppRoles.SUPER_ADMIN || AppRoles.ADMIN) && (
                  <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Edit Profile
                    </h2>
                    <UpdateUserForm />
                    <div className="rounded-lg border border-grey-100 p-4 bg-gray-50">
                      <p className="paragraph-medium-medium">
                        Newsletters
                      </p>
                      <p className="paragraph-small-normal text-black-300 mt-1">
                        Modifie les categories pour recevoir les newsletters
                        qui t'interessent.
                      </p>
                      <Link href="/newsletter/categories">
                        <Button variant="outline" className="mt-3">
                          Editer mes categories
                        </Button>
                      </Link>
                    </div>
                    <div className="rounded-lg border border-grey-100 p-4 bg-gray-50">


                      <p className="paragraph-medium-medium">


                        Redacteur


                      </p>


                      <p className="paragraph-small-normal text-black-300 mt-1">


                        Deviens redacteur pour creer et gerer des newsletters.


                      </p>


                      <Link href="/newsletter/redacteur">


                        <Button variant="outline" className="mt-3">


                          Demander l'acces redacteur


                        </Button>


                      </Link>


                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
