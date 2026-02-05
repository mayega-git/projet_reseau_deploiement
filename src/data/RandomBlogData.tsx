import { BlogInterface } from '@/types/blog';

export const coverBlogData: BlogInterface = {
  id: '90',
  coverImage: '/images/content/background1.jpg',
  authorId: '123e4567-e89b-12d3-a456-426614174000',
  organisationId: null,
  title: 'Passengers Responsibilities',
  status: 'PUBLISHED',
  description:
    "Travelling is much more than visiting new places; it's also about respecting those who welcome us. By being aware of our responsibilities, we enrich our experience while preserving cultures and environments.",
  content:
    "Travelling is much more than visiting new places; it's also about respecting those who welcome us. By being aware of our responsibilities, we enrich our experience while preserving cultures and environments.",
  audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  audioLength: 180, // 3 minutes
  createdAt: '2024-08-08T08:45:00.000Z', // ISO format
  publishedAt: '2024-10-08T09:00:00.000Z',
  domain: 'education',
  contentType: 'blog',
  readingTime: 7,
  tags: ['travel', 'history', 'dangerous roads'],
  category: ['1256'],
};

// export const AllBlogData: BlogInterface[] = [
//   {
//     id: '1',
//     coverImage: '/images/content/falaise.png',
//     authorId: '123e4567-e89b-12d3-a456-426614174000',
//     title: 'The Dschang Cliff',
//     description:
//       "The Dschang Cliff, also known as 'The Road of Death,' is a winding and dangerous route in Cameroon.",
//     content:
//       'The Dschang Cliff is a significant route in Cameroon known for its extreme sharp bends and high accident rates...',
//     audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
//     audioLength: 180, // 3 minutes
//     createdAt: '2024-09-08T08:45:00.000Z', // ISO format
//     publishedAt: '2024-09-08T09:00:00.000Z',
//     readingTime: 5,
//     tags: ['travel', 'history', 'dangerous roads'],
//     categoryId: '1256',
//   },
//   {
//     id: '2',
//     coverImage: '/images/content/street.png',
//     authorId: '234e5678-f98c-23d4-b567-526715285001',
//     title: 'The Common Taxi',
//     description:
//       'A deep dive into the role of taxis in daily urban transportation across Cameroon and Africa.',
//     content:
//       'Taxis are a crucial part of urban mobility in Cameroon, offering affordable and convenient transport...',
//     audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
//     audioLength: 220, // 3 min 40 sec
//     createdAt: '2024-08-24T14:20:00.000Z',
//     publishedAt: '2024-08-24T15:00:00.000Z',
//     readingTime: 4,
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
//     content:
//       'The Yaoundé-Douala highway is a key transport route connecting the economic capital and the political capital...',
//     createdAt: '2024-11-19T10:30:00.000Z',
//     publishedAt: '2024-11-19T11:00:00.000Z',
//     readingTime: 6,
//     tags: ['infrastructure', 'transport', 'development'],
//     categoryId: '1256',
//   },
//   {
//     id: '4',
//     coverImage: '/images/content/accident.png',
//     authorId: '456g7890-h19e-45f6-d789-747917507003',
//     title: 'Road Accidents in Cameroon',
//     description:
//       'A look into the rising number of road accidents in Cameroon and possible solutions.',
//     content:
//       'With poor road conditions and reckless driving, road accidents have become a serious issue in Cameroon...',
//     audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
//     audioLength: 150, // 2 min 30 sec
//     createdAt: '2025-01-01T07:15:00.000Z',
//     publishedAt: '2025-01-01T07:45:00.000Z',
//     readingTime: 5,
//     tags: ['safety', 'transport', 'Cameroon'],
//     categoryId: '1256',
//   },
//   {
//     id: '5',
//     coverImage: '/images/content/manengouba.png',
//     authorId: '567h8901-i29f-56g7-e890-858018618004',
//     title: 'Mount Manengouba: A Hidden Treasure',
//     description:
//       'A guide to one of the most beautiful yet less explored mountains in Cameroon.',
//     content:
//       'Mount Manengouba is an ecological treasure with stunning landscapes, rich biodiversity, and cultural significance...',
//     createdAt: '2025-02-12T09:00:00.000Z',
//     publishedAt: '2025-02-12T09:30:00.000Z',
//     readingTime: 7,
//     tags: ['nature', 'adventure', 'Cameroon'],
//     categoryId: '1256',
//   },
//   {
//     id: '6',
//     coverImage: '/images/content/roadsigns.png',
//     authorId: '678i9012-j39g-67h8-f901-969119729005',
//     title: 'Road Signs and Their Importance',
//     description:
//       'Understanding different road signs and how they contribute to safer roads.',
//     content:
//       'Road signs play a crucial role in traffic management, helping to reduce accidents and guide drivers...',
//     createdAt: '2025-01-26T12:45:00.000Z',
//     publishedAt: '2025-01-26T13:00:00.000Z',
//     readingTime: 4,
//     tags: ['safety', 'education', 'driving'],
//     categoryId: '1256',
//   },
//   {
//     id: '90',
//     coverImage: '/images/content/background1.jpg',
//     authorId: '123e4567-e89b-12d3-a456-426614174000',
//     title: 'Passengers Responsibilities',
//     description:
//       "Travelling is much more than visiting new places; it's also about respecting those who welcome us. By being aware of our responsibilities, we enrich our experience while preserving cultures and environments.",
//     content:
//       "Travelling is much more than visiting new places; it's also about respecting those who welcome us. By being aware of our responsibilities, we enrich our experience while preserving cultures and environments.",
//     audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
//     audioLength: 180, // 3 minutes
//     createdAt: '2024-08-08T08:45:00.000Z', // ISO format
//     publishedAt: '2024-10-08T09:00:00.000Z',
//     readingTime: 7,
//     tags: ['travel', 'history', 'dangerous roads'],
//     categoryId: '1256',
//   },
// ];

// export const mostRecentBlogs: BlogInterface[] = [
//   {
//     id: '1',
//     coverImage: '/images/content/falaise.png',
//     authorId: '123e4567-e89b-12d3-a456-426614174000',
//     title: 'The Dschang Cliff',
//     description:
//       "The Dschang Cliff, also known as 'The Road of Death,' is a winding and dangerous route in Cameroon.",
//     content:
//       'The Dschang Cliff is a significant route in Cameroon known for its extreme sharp bends and high accident rates...',
//     audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
//     audioLength: 180, // 3 minutes
//     createdAt: '2024-09-08T08:45:00.000Z', // ISO format
//     publishedAt: '2024-09-08T09:00:00.000Z',
//     readingTime: 5,
//     tags: ['travel', 'history', 'dangerous roads'],
//     categoryId: '1256',
//   },
//   {
//     id: '5',
//     coverImage: '/images/content/manengouba.png',
//     authorId: '567h8901-i29f-56g7-e890-858018618004',
//     title: 'Mount Manengouba: A Hidden Treasure',
//     description:
//       'A guide to one of the most beautiful yet less explored mountains in Cameroon.',
//     content:
//       'Mount Manengouba is an ecological treasure with stunning landscapes, rich biodiversity, and cultural significance...',
//     createdAt: '2025-02-12T09:00:00.000Z',
//     publishedAt: '2025-02-12T09:30:00.000Z',
//     readingTime: 7,
//     tags: ['nature', 'adventure', 'Cameroon'],
//     categoryId: '1256',
//   },
//   {
//     id: '6',
//     coverImage: '/images/content/roadsigns.png',
//     authorId: '678i9012-j39g-67h8-f901-969119729005',
//     title: 'Road Signs and Their Importance',
//     description:
//       'Understanding different road signs and how they contribute to safer roads.',
//     content:
//       'Road signs play a crucial role in traffic management, helping to reduce accidents and guide drivers...',
//     createdAt: '2025-01-26T12:45:00.000Z',
//     publishedAt: '2025-01-26T13:00:00.000Z',
//     readingTime: 4,
//     tags: ['safety', 'education', 'driving'],
//     categoryId: '1256',
//   },
// ];

// export const mostPopularBlogs: BlogInterface[] = [
//   {
//     id: '2',
//     coverImage: '/images/content/street.png',
//     authorId: '234e5678-f98c-23d4-b567-526715285001',
//     title: 'The Common Taxi',
//     description:
//       'A deep dive into the role of taxis in daily urban transportation across Cameroon and Africa.',
//     content:
//       'Taxis are a crucial part of urban mobility in Cameroon, offering affordable and convenient transport...',
//     audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
//     audioLength: 220, // 3 min 40 sec
//     createdAt: '2024-08-24T14:20:00.000Z',
//     publishedAt: '2024-08-24T15:00:00.000Z',
//     readingTime: 4,
//     tags: ['transport', 'urban life', 'Cameroon'],
//     categoryId: '1256',
//   },
//   {
//     id: '4',
//     coverImage: '/images/content/accident.png',
//     authorId: '456g7890-h19e-45f6-d789-747917507003',
//     title: 'Road Accidents in Cameroon',
//     description:
//       'A look into the rising number of road accidents in Cameroon and possible solutions.',
//     content:
//       'With poor road conditions and reckless driving, road accidents have become a serious issue in Cameroon...',
//     audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
//     audioLength: 150, // 2 min 30 sec
//     createdAt: '2025-01-01T07:15:00.000Z',
//     publishedAt: '2025-01-01T07:45:00.000Z',
//     readingTime: 5,
//     tags: ['safety', 'transport', 'Cameroon'],
//     categoryId: '1256',
//   },
//   {
//     id: '5',
//     coverImage: '/images/content/manengouba.png',
//     authorId: '567h8901-i29f-56g7-e890-858018618004',
//     title: 'Mount Manengouba: A Hidden Treasure',
//     description:
//       'A guide to one of the most beautiful yet less explored mountains in Cameroon.',
//     content:
//       'Mount Manengouba is an ecological treasure with stunning landscapes, rich biodiversity, and cultural significance...',
//     createdAt: '2025-02-12T09:00:00.000Z',
//     publishedAt: '2025-02-12T09:30:00.000Z',
//     readingTime: 7,
//     tags: ['nature', 'adventure', 'Cameroon'],
//     categoryId: '1256',
//   },
// ];
