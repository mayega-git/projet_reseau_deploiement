import { PodcastInterface } from '@/types/podcast';

export const coverPodcastData: PodcastInterface = {
  id: '90',
  coverImage: '/images/content/background2.jpg',
  authorId: '123e4567-e89b-12d3-a456-426614174000',
  title: 'Infrastructure Insights',
  status: 'PUBLISHED',
  description: 'How Cameroon’s infrastructure impacts daily travel and safety.',
  audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  audioLength: 180, // 3 minutes
  createdAt: '2024-08-08T08:45:00.000Z', // ISO format
  publishedAt: '2024-10-08T09:00:00.000Z',
  tags: ['travel', 'history', 'dangerous roads'],
  categoryId: '1256',
};

// export const AllPodcastData: PodcastInterface[] = [
//   {
//     id: '1',
//     coverImage: '/images/content/podcast1.webp',
//     authorId: '123e4567-e89b-12d3-a456-426614174000',
//     title: 'The Dschang Cliff',
//     description:
//       "The Dschang Cliff, also known as 'The Road of Death,' is a winding and dangerous route in Cameroon.",
//     audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
//     audioLength: 180, // 3 minutes
//     createdAt: '2024-09-08T08:45:00.000Z', // ISO format
//     publishedAt: '2024-09-08T09:00:00.000Z',
//     tags: ['travel', 'history', 'dangerous roads'],
//     categoryId: '1256',
//   },
//   {
//     id: '2',
//     coverImage: '/images/content/podcast2.jpg',
//     authorId: '234e5678-f98c-23d4-b567-526715285001',
//     title: 'The Common Taxi',
//     description:
//       'A deep dive into the role of taxis in daily urban transportation across Cameroon and Africa.',

//     audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
//     audioLength: 220, // 3 min 40 sec
//     createdAt: '2024-08-24T14:20:00.000Z',
//     publishedAt: '2024-08-24T15:00:00.000Z',
//     tags: ['transport', 'urban life', 'Cameroon'],
//     categoryId: '1256',
//   },
//   {
//     id: '3',
//     coverImage: '/images/content/highway.png',
//     authorId: '345f6789-g09d-34e5-c678-636816396002',
//     title: 'The Yaoundé-Douala Highway',
//     description:
//       'Exploring the impact and challenges of Cameroon’s most important highway.',
//     createdAt: '2024-11-19T10:30:00.000Z',
//     publishedAt: '2024-11-19T11:00:00.000Z',
//     audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
//     audioLength: 150, // 2 min 30 sec
//     tags: ['infrastructure', 'transport', 'development'],
//     categoryId: '1256',
//   },
//   {
//     id: '4',
//     coverImage: '/images/content/podcast3.webp',
//     authorId: '456g7890-h19e-45f6-d789-747917507003',
//     title: 'Road Accidents in Cameroon',
//     description:
//       'A look into the rising number of road accidents in Cameroon and possible solutions.',
//     audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
//     audioLength: 150, // 2 min 30 sec
//     createdAt: '2025-01-01T07:15:00.000Z',
//     publishedAt: '2025-01-01T07:45:00.000Z',

//     tags: ['safety', 'transport', 'Cameroon'],
//     categoryId: '1256',
//   },
//   {
//     id: '5',
//     coverImage: '/images/content/podcast4.png',
//     authorId: '567h8901-i29f-56g7-e890-858018618004',
//     title: 'Mount Manengouba: A Hidden Treasure',
//     description:
//       'A guide to one of the most beautiful yet less explored mountains in Cameroon.',
//     createdAt: '2025-02-12T09:00:00.000Z',
//     publishedAt: '2025-02-12T09:30:00.000Z',
//     audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
//     audioLength: 150, // 2 min 30 sec
//     tags: ['nature', 'adventure', 'Cameroon'],
//     categoryId: '1256',
//   },
//   {
//     id: '6',
//     coverImage: '/images/content/podcast5.png',
//     authorId: '678i9012-j39g-67h8-f901-969119729005',
//     title: 'Road Signs and Their Importance',
//     description:
//       'Understanding different road signs and how they contribute to safer roads.',
//     createdAt: '2025-01-26T12:45:00.000Z',
//     publishedAt: '2025-01-26T13:00:00.000Z',
//     audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
//     audioLength: 150, // 2 min 30 sec
//     tags: ['safety', 'education', 'driving'],
//     categoryId: '1256',
//   },
//   {
//     id: '90',
//     coverImage: '/images/content/background2.jpg',
//     authorId: '123e4567-e89b-12d3-a456-426614174000',
//     title: 'Infrastructure Insights',
//     description:
//       'How Cameroon’s infrastructure impacts daily travel and safety.',
//     audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
//     audioLength: 180, // 3 minutes
//     createdAt: '2024-08-08T08:45:00.000Z', // ISO format
//     publishedAt: '2024-10-08T09:00:00.000Z',
//     tags: ['travel', 'history', 'dangerous roads'],
//     categoryId: '456',
//   },
// ];

// export const mostRecentPodcast: PodcastInterface[] = [
//   {
//     id: '1',
//     coverImage: '/images/content/podcast1.webp',
//     authorId: '123e4567-e89b-12d3-a456-426614174000',
//     title: 'The Dschang Cliff',
//     description:
//       "The Dschang Cliff, also known as 'The Road of Death,' is a winding and dangerous route in Cameroon.",
//     audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
//     audioLength: 180, // 3 minutes
//     createdAt: '2024-09-08T08:45:00.000Z', // ISO format
//     publishedAt: '2024-09-08T09:00:00.000Z',
//     tags: ['travel', 'history', 'dangerous roads'],
//     categoryId: '1256',
//   },
//   {
//     id: '2',
//     coverImage: '/images/content/podcast2.jpg',
//     authorId: '234e5678-f98c-23d4-b567-526715285001',
//     title: 'The Common Taxi',
//     description:
//       'A deep dive into the role of taxis in daily urban transportation across Cameroon and Africa.',

//     audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
//     audioLength: 220, // 3 min 40 sec
//     createdAt: '2024-08-24T14:20:00.000Z',
//     publishedAt: '2024-08-24T15:00:00.000Z',
//     tags: ['transport', 'urban life', 'Cameroon'],
//     categoryId: '1256',
//   },
//   {
//     id: '3',
//     coverImage: '/images/content/highway.png',
//     authorId: '345f6789-g09d-34e5-c678-636816396002',
//     title: 'The Yaoundé-Douala Highway',
//     description:
//       'Exploring the impact and challenges of Cameroon’s most important highway.',
//     createdAt: '2024-11-19T10:30:00.000Z',
//     publishedAt: '2024-11-19T11:00:00.000Z',
//     audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
//     audioLength: 150, // 2 min 30 sec
//     tags: ['infrastructure', 'transport', 'development'],
//     categoryId: '1256',
//   },
// ];

// export const mostPopularPodcasts: PodcastInterface[] = [
//   {
//     id: '4',
//     coverImage: '/images/content/podcast3.webp',
//     authorId: '456g7890-h19e-45f6-d789-747917507003',
//     title: 'Road Accidents in Cameroon',
//     description:
//       'A look into the rising number of road accidents in Cameroon and possible solutions.',
//     audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
//     audioLength: 150, // 2 min 30 sec
//     createdAt: '2025-01-01T07:15:00.000Z',
//     publishedAt: '2025-01-01T07:45:00.000Z',

//     tags: ['safety', 'transport', 'Cameroon'],
//     categoryId: '1256',
//   },
//   {
//     id: '5',
//     coverImage: '/images/content/podcast4.png',
//     authorId: '567h8901-i29f-56g7-e890-858018618004',
//     title: 'Mount Manengouba: A Hidden Treasure',
//     description:
//       'A guide to one of the most beautiful yet less explored mountains in Cameroon.',
//     createdAt: '2025-02-12T09:00:00.000Z',
//     publishedAt: '2025-02-12T09:30:00.000Z',
//     audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
//     audioLength: 150, // 2 min 30 sec
//     tags: ['nature', 'adventure', 'Cameroon'],
//     categoryId: '1256',
//   },
//   {
//     id: '6',
//     coverImage: '/images/content/podcast5.png',
//     authorId: '678i9012-j39g-67h8-f901-969119729005',
//     title: 'Road Signs and Their Importance',
//     description:
//       'Understanding different road signs and how they contribute to safer roads.',
//     createdAt: '2025-01-26T12:45:00.000Z',
//     publishedAt: '2025-01-26T13:00:00.000Z',
//     audioFile: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
//     audioLength: 150, // 2 min 30 sec
//     tags: ['safety', 'education', 'driving'],
//     categoryId: '1256',
//   },
// ];
