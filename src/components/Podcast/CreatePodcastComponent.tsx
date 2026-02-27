/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useEffect, useState } from 'react';
import FileUpload from '../ui/FileUpload';
import TextArea from '../ui/textarea';
import CustomButton from '../ui/customButton';
import MultiSelectDropdown from '../ui/MultiSelectDropdown';
import AudioPlayerPreview from '../AudioPlayer/AudioPlayerPreview';
import { CreatePodcastInterface } from '@/types/podcast';
import { calculateReadingTime } from '@/helper/calculateReadingTime';
import { TagInterface } from '@/types/tag';
import { fetchAllTags as serverFetchTags, fetchAllCategories as serverFetchCategories, createPodcast as serverCreatePodcast } from '@/actions/education';
import { CategoryInterface } from '@/types/category';
import SingleSelectDropdown from '../ui/SingleComponentDropdown';
import { useAuth } from '@/context/AuthContext';
import { useGlobalState } from '@/context/GlobalStateContext';
import { getOrganisationsForUser } from '@/actions/user';
import { GetUser } from '@/types/User';
import {
  convertFromRaw,
  convertToRaw,
  DraftHandleValue,
  Editor,
  EditorState,
  RawDraftContentState,
  RichUtils,
} from 'draft-js';
import DraftEditor from '../Editor/DraftEditor';
import { GlobalNotifier } from '../ui/GlobalNotifier';
import Loader from '../Loader/Loader';
import { Button } from '../ui/button';

const CreatePodcastComponent = () => {
  const { user } = useAuth();
  const { domains } = useGlobalState();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<{
    name: string;
    size: number;
    data: string;
  } | null>(null);
  const [podcastAudio, setPodcastAudio] = useState<{
    name: string;
    size: number;
    data: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tags, setTags] = useState<TagInterface[]>([
    {
      id: '',
      name: '',
      description: '',
      createdAt: '',
      updatedAt: '',
      domain: '',
    },
  ]);
  const [categories, setCategories] = useState<CategoryInterface[]>([
    {
      id: '',
      name: '',
      description: '',
      createdAt: '',
      updatedAt: '',
      domain: '',
    },
  ]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [podcastData, setPodcastData] = useState<CreatePodcastInterface>({
    coverImage: '',
    authorId: '',
    organisationId: '',
    title: '',
    description: '',
    audioUrl: '',
    domain: 'TAXI',
    tags: [],
    categories: [], 
  });

  async function fetchAllTags() {
    try {
      const data = await serverFetchTags();
      setTags(data as TagInterface[]);
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  }

  async function fetchAllCategories() {
    try {
      const data = await serverFetchCategories();
      setCategories(data as CategoryInterface[]);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }

  const base64ToFile = (base64: string, filename: string, mimeType: string) => {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], filename, { type: mimeType });
  };

  useEffect(() => {
    fetchAllTags();
    fetchAllCategories();
    if (user?.id) {
      getOrganisationsForUser(user.id)
        .then(setOrganisations)
        .catch(err => console.error('Error fetching organisations', err));
    }
  }, [user?.id]);

  const [organisations, setOrganisations] = useState<GetUser[]>([]);

  const [preview, setPreview] = useState<boolean>(false);

  // ✅ Function to Validate Form Fields
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!podcastData.title.trim()) newErrors.title = 'Title is required';
    if (!podcastData.description.trim())
      newErrors.description = 'Description is required';
    if (!podcastData.coverImage)
      newErrors.coverImage = 'Cover image is required';
    if (!podcastData.audioUrl) newErrors.audioFile = 'Audio File is required';
    if (podcastData.tags.length === 0)
      newErrors.tags = 'At least one tag is required';
    if (!podcastData.categories)
      newErrors.categoryId = 'At least one category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //form  validation
    if (!validateForm()) return;

    console.log('Submitting Podcast:', podcastData);

    // api call...
    const formData = new FormData();

    // Add non-file data (stringify the data)
    formData.append(
      'data',
      JSON.stringify({
        title: podcastData.title,
        description: podcastData.description,
        authorId: user?.id,
        organisationId: podcastData.organisationId || undefined,
        domain: podcastData.domain,
        tags: podcastData.tags,
        categories: podcastData.categories,
      })
    );
    // Step 2: Add the file data

    if (podcastData.coverImage) {
      const coverImageFile = base64ToFile(
        podcastData.coverImage,
        'cover.jpg',
        'image/jpeg'
      );

      formData.append('cover', coverImageFile);
    }

    if (podcastData.audioUrl) {
      const audioFile = base64ToFile(
        podcastData.audioUrl,
        'audio.mp3',
        'audio/mpeg'
      );

      formData.append('audio', audioFile); // Assuming audioFile is a File object
    }

    // Debugging: Log FormData entries
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      setIsLoading(true);
      const result = await serverCreatePodcast(formData);

      if (result.success) {
        GlobalNotifier('Podcast created successfully', 'success');
        window.location.reload();
      } else {
        GlobalNotifier(result.error ?? 'Error creating podcast', 'error');
      }
    } catch (err) {
      console.error('Error creating podcast:', err);
      GlobalNotifier('An unexpected error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  //   //preview blog settings
  //   const handlePreview = (e: React.FormEvent) => {
  //     e.preventDefault();

  //     //form  validation
  //     if (!validateForm()) return;

  //     //preview content
  //     setPreview(true);
  //   };

  useEffect(() => {
    console.log(podcastAudio, 'podcastAudio');
    console.log(coverImage, 'coverImage');
  }, [podcastAudio, coverImage]);

  return (
    <>
      {!preview ? (
        <div className="mt-12 create-blog-form-height w-full max-w-[1200px] mx-auto flex flex-col gap-8">
          <p className="h4-medium font-semibold">Create new Podcast</p>

          <form className="create-blog-form-height border border-grey-300  rounded-lg flex flex-col gap-4 w-full">
            <div className="w-full h-full overflow-y-auto">
              <div className="w-full flex flex-col gap-6 px-6 py-8 ">
                {/* Podcast Title*/}
                <div className="flex flex-col gap-3">
                  <label className="form-label" htmlFor="title">
                    Podcast Title{' '}
                    <span className="content-date text-[14px]">(required)</span>
                  </label>
                  <TextArea
                    value={podcastData.title}
                    label="Podcast Title"
                    height="30px"
                    placeholder=""
                    maxWords={50}
                    onChange={(value) =>
                      setPodcastData({ ...podcastData, title: value })
                    }
                  />
                  {errors.title && (
                    <p className="mt-[-8px] text-redTheme paragraph-small-normal">
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Podcast description */}
                <div className="flex flex-col gap-3">
                  <label className="form-label" htmlFor="title">
                    Description{' '}
                    <span className="content-date text-[14px]">(required)</span>
                  </label>
                  <TextArea
                    value={podcastData.description}
                    label="Podcast Description"
                    height="60px"
                    placeholder=""
                    maxWords={50}
                    onChange={(value) =>
                      setPodcastData({ ...podcastData, description: value })
                    }
                  />
                  {errors.description && (
                    <p className="mt-[-8px] text-redTheme paragraph-small-normal">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Cover Image */}
                <div className="flex flex-col gap-3">
                  <label className="form-label" htmlFor="title">
                    Cover Image{' '}
                    <span className="content-date text-[14px]">(required)</span>
                  </label>
                  <FileUpload
                    id="coverImage-image-upload"
                    type="Image"
                    maxSizeMB={10}
                    acceptedFormats={['image/jpeg', 'image/png']}
                    onFileSelect={(file) =>
                      setPodcastData({ ...podcastData, coverImage: file.data })
                    }
                  />
                  {errors.coverImage && (
                    <p className="mt-[-8px] text-redTheme paragraph-small-normal">
                      {errors.coverImage}
                    </p>
                  )}
                </div>

                {/* Select Organisation */}
                {organisations.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <label className="form-label" htmlFor="domain">
                      Select an Organisation
                      <span className="content-date text-[14px]"> (optional)</span>
                    </label>
                    <SingleSelectDropdown
                      choices={organisations.map(org => org.firstName || org.id)} 
                      selectedChoiceId={podcastData.organisationId 
                        ? (organisations.find(o => o.id === podcastData.organisationId)?.firstName || podcastData.organisationId) 
                        : ''}
                      setSelectedChoiceId={(selectedName) => { 
                        const org = organisations.find(o => o.firstName === selectedName || o.id === selectedName);
                        setPodcastData({ ...podcastData, organisationId: org ? org.id : '' });
                      }}
                    />
                  </div>
                )}

                {/* Select tags */}
                <div className="flex flex-col gap-3">
                  <label className="form-label" htmlFor="title">
                    Select Tags
                  </label>
                  <MultiSelectDropdown
                    choices={tags}
                    selectedChoices={podcastData.tags}
                    setSelectedChoices={(selected) =>
                      setPodcastData({ ...podcastData, tags: selected })
                    }
                  />
                  {errors.tags && (
                    <p className="mt-[-8px] text-redTheme paragraph-small-normal">
                      {errors.tags}
                    </p>
                  )}
                </div>

                {/* Select domain */}
                {/* Select domain */}
                
                <div className="flex flex-col gap-3">
                  <label className="form-label" htmlFor="domain">
                    Select a Domain{' '}
                    <span className="content-date text-[14px]">(required)</span>
                  </label>
                  <SingleSelectDropdown
                    choices={domains} // 
                    selectedChoiceId={podcastData.domain}
                    setSelectedChoiceId={(selected) =>
                      setPodcastData({ ...podcastData, domain: selected })
                    }
                  />
                  {errors.domain && (
                    <p className="mt-[-8px] text-redTheme paragraph-small-normal">
                      {errors.domain}
                    </p>
                  )}
                </div>
                 {/* Select categories */}
                <div className="flex flex-col gap-3">
                  <label className="form-label" htmlFor="title">
                    Select a category
                  </label>
                  <MultiSelectDropdown
                    choices={categories}
                    selectedChoices={podcastData.categories}
                    setSelectedChoices={(selected) =>
                      setPodcastData({ ...podcastData, categories: selected })
                    }
                  />
                  {errors.category && (
                    <p className="mt-[-8px] text-redTheme paragraph-small-normal">
                      {errors.categories}
                    </p>
                  )}
                </div>

                {/* Podcast Audio */}
                <div className="flex flex-col gap-3">
                  <label className="form-label" htmlFor="title">
                    Upload Podcast Audio{' '}
                    <span className="content-date text-[14px]">(required)</span>
                  </label>
                  <FileUpload
                    id="blog-audio-upload"
                    type="Audio"
                    onFileSelect={(file) =>
                      setPodcastData({ ...podcastData, audioUrl: file.data })
                    }
                    maxSizeMB={10}
                    acceptedFormats={['audio/mpeg', 'audio/wav', 'audio/ogg']}
                  />
                  {errors.audioFile && (
                    <p className="mt-[-8px] text-redTheme paragraph-small-normal">
                      {errors.audioFile}
                    </p>
                  )}
                  {podcastData?.audioUrl ? (
                    <AudioPlayerPreview
                      type="podcast"
                      data={podcastData.audioUrl}
                    />
                  ) : null}
                </div>
              </div>
            </div>
            {/* buttons */}
            <div className="flex justify-end items-center gap-2 border-t border-t-grey-300 py-4 px-8">
              {/* <CustomButton onClick={handlePreview} variant="primaryOutline">
                Preview
              </CustomButton> */}
              <Button
                disabled={isLoading}
                onClick={handleSubmit}
                variant="default"
              >
                {isLoading && <Loader />}
                Create
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex flex-col gap-4 h-full w-full max-w-[1200px] mx-auto px-4 mt-12">
          {/* <div className="h-full w-full overflow-y-auto">
            <div className="w-full flex flex-col gap-6 px-6 py-8 ">
              <BlogPreview blog={podcastData} />
            </div>
          </div> */}
          {/* buttons */}
          {/* <div className="flex justify-end items-center gap-2 border-t border-t-grey-300 py-4 px-8">
            <CustomButton
              onClick={() => setPreview(false)}
              // variant="primaryOutline"
              className="text-primaryPurple-500 bg-white border border-primaryPurple-500 hover:bg-[#e0e0e580]"
              style={{ border: '1px solid var(--primaryPurple-500)' }}
            >
              Edit
            </CustomButton>
            <CustomButton onClick={handleSubmit} variant="primary">
              Create
            </CustomButton>
          </div> */}
        </div>
      )}
    </>
  );
};

export default CreatePodcastComponent;
function draftToHtml(rawContent: RawDraftContentState): string {
  throw new Error('Function not implemented.');
}
