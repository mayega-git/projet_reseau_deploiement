'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import FileUpload from '../ui/FileUpload';

import TextArea from '../ui/textarea';
import CustomButton from '../ui/customButton';
import MultiSelectDropdown from '../ui/MultiSelectDropdown';
import AudioPlayerPreview from '../AudioPlayer/AudioPlayerPreview';
import { CreateCourseInterface } from '@/types/blog';
import { calculateReadingTime } from '@/helper/calculateReadingTime';
import { TagInterface } from '@/types/tag';
import { fetchAllTags as serverFetchTags, fetchAllCategories as serverFetchCategories, createCourse as serverCreateCourse } from '@/actions/education';
import { CategoryInterface } from '@/types/category';
import SingleSelectDropdown from '../ui/SingleComponentDropdown';
import { useAuth } from '@/context/AuthContext';
import { useGlobalState } from '@/context/GlobalStateContext';
import { getOrganisationsForUser } from '@/actions/user';
import { GetUser } from '@/types/User';
import {
  convertFromRaw,
  convertToRaw,
  EditorState,
} from 'draft-js';
import { GlobalNotifier } from '../ui/GlobalNotifier';
import Loader from '../Loader/Loader';
import { Button } from '../ui/button';
import { ContentPreview } from '../Content';


const DraftEditor = dynamic(() => import('../Editor/DraftEditor'), {
  ssr: false,
  loading: () => <div className="editor-wrapper" style={{ minHeight: '200px', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>Loading editor...</div>,
});

const CreateCourseComponent = () => {
  const { user } = useAuth();
  const { domains } = useGlobalState();

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
  const [courseData, setCourseData] = useState<CreateCourseInterface>({
    coverImage: '',
    authorId: '',
    organisationId: '',
    title: '',
    description: '',
    content: '',
    audioUrl: '',
    readingTime: 0,
    domain: '',
    tags: [],
    categories: [],
    trainerName: '',
    duration: '',
    level: '' 
  });

  const extractMimeType = (fileName: string, base64Data: string): string => {
    // Essayer d'extraire du Data URL
    const dataUrlMatch = base64Data.match(/^data:([^;]+);base64,/);
    if (dataUrlMatch) return dataUrlMatch[1];
    
    // Sinon, déduire de l'extension
    const ext = fileName.split('.').pop()?.toLowerCase();
    const mimeMap: Record<string, string> = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
    };
    
    return mimeMap[ext || ''] || 'image/jpeg';
  };
  const [coverImageName, setCoverImageName] = useState<string>('');

  //draft js
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(
      convertFromRaw({
        blocks: [
          {
            key: '9adb5',
            text: 'Write your blog here',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [
              { offset: 19, length: 6, style: 'BOLD' },
              { offset: 25, length: 5, style: 'ITALIC' },
              { offset: 30, length: 8, style: 'UNDERLINE' },
            ],
            entityRanges: [],
            data: {},
          },
          {
            key: '9adb5',
            text: '',
            type: 'header-one',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
          },
        ],
        entityMap: {},
      })
    )
  );

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

  // Function to get plain text from Draft.js content
  const getPlainText = (editorState: EditorState): string => {
    const rawContent = convertToRaw(editorState.getCurrentContent());
    return rawContent.blocks.map((block) => block.text).join(' '); // Join block texts
  };

  const sendEditorContentToBackend = (editorState: EditorState) => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState); // Get raw content

    // Send raw content to the backend (blocks + entityMap)
    const rawContentString = JSON.stringify(rawContent); // Convert to string

    // console.log(rawContentString, 'logged in sendeditor to backend');
    // Send rawContentString to your backend
    return rawContentString;
  };

  const [organisations, setOrganisations] = useState<GetUser[]>([]);
  const [selectedPublisherName, setSelectedPublisherName] = useState<string>('');

  const userName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'My Profile';
  const publishAsChoices = [
    userName,
    ...organisations.map(org => org.firstName || org.id)
  ];

  //Function to convert file to base64 encoded
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

  useEffect(() => {
    if (userName && !selectedPublisherName) {
      setSelectedPublisherName(userName);
    }
  }, [userName, selectedPublisherName]);

  const [preview, setPreview] = useState<boolean>(false);

  // Function to Validate Form Fields
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    console.log(
      courseData,
      'course data logged when validate form or preview is clicked'
    );

    if (!courseData.title.trim()) newErrors.title = 'Title is required';
    if (!courseData.description.trim())
      newErrors.description = 'Description is required';
    if (!courseData.content || courseData.content === '{}')
      newErrors.content = 'Content is required';
    if (!courseData.coverImage) newErrors.coverImage = 'Cover image is required';
    if (courseData.tags.length === 0)
      newErrors.tags = 'At least one tag is required';
    if (courseData.categories.length === 0)
      newErrors.categoryId = 'At least one category is required';

    if (!courseData.domain || courseData.domain.trim() === '') 
      newErrors.domain = 'Domain is required';

    if (!selectedPublisherName) {
      newErrors.publisher = 'Please select who is publishing this course.';
    }

    if (!courseData.level?.trim()) newErrors.level = 'Course level is required';
    if (!courseData.duration?.trim()) newErrors.duration = 'Course duration is required';

    if (!courseData.trainerName || courseData.trainerName.trim() === '') 
      courseData.trainerName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();  

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Submit button clicked');
    e.preventDefault();

    //extract content
    const extractedContent = sendEditorContentToBackend(editorState);

    const rawText = getPlainText(editorState);
    const readingTime = calculateReadingTime(rawText);

    //set course
    setCourseData((prev) => ({
      ...prev,
      content: extractedContent,
      readingTime: readingTime,
    }));

    //form  validation
    if (!validateForm()) return;

    // api call...
    const formData = new FormData();

    // Add non-file data (stringify the data)
    const dataPayload = {
        title: courseData.title,
        description: courseData.description,
        content: sendEditorContentToBackend(editorState),
        authorId: user?.id,
        readingTime: courseData.readingTime,
        tags: courseData.tags,
        categories: courseData.categories,
        domain: courseData.domain,
        level: courseData.level,
        duration: courseData.duration,
        trainerName: courseData.trainerName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
        organisationId: courseData.organisationId || undefined,
        plateformeId:'e4d3d2e9-1a2b-3c4d-5e6f-7a8b9c0d1e2f'
    };
    console.log('🚀 [DEBUG] Actual payload sent to backend:', JSON.stringify(dataPayload, null, 2));
    console.log('🔑 [DEBUG] user?.id =', user?.id, '| user object =', user);
    formData.append('data', JSON.stringify(dataPayload));
    // Step 2: Add the file data

    if (courseData.coverImage) {

         const fileName = coverImageName || 'cover.jpg';

    const mimeType = extractMimeType(fileName, courseData.coverImage);

      const coverImageFile = base64ToFile(
        courseData.coverImage,
       fileName,
        mimeType
      );

      formData.append('cover', coverImageFile);
    }

    if (courseData.audioUrl) {
      const audioFile = base64ToFile(
        courseData.audioUrl,
        'audio.mp3',
        'audio/mpeg'
      );

      formData.append('audio', audioFile);
    }

    try {
      setIsLoading(true);
      const result = await serverCreateCourse(formData);

      if (result.success) {
        GlobalNotifier('Course created successfully', 'success');
        window.location.reload();
      } else {
        GlobalNotifier(result.error ?? 'Error creating course', 'error');
      }
    } catch (err) {
      console.error('Error creating course:', err);
      GlobalNotifier('An unexpected error occurred', 'error');
    } finally {
      setIsLoading(false);
    }

  };

  //preview blog settings
  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();

    //extract content
    const extractedContent = sendEditorContentToBackend(editorState);
    const rawText = getPlainText(editorState);
    const readingTime = calculateReadingTime(rawText);

    //set course
    setCourseData((prev) => ({
      ...prev,
      content: extractedContent,
      readingTime: readingTime,
    }));

    //form  validation
    if (!validateForm()) return;

    //preview content
    setPreview(true);
  };

  return (
    <>
      {!preview ? (
        <div className="mt-12 create-blog-form-height w-full max-w-[1200px] mx-auto flex flex-col gap-8">
          <p className="h4-medium font-semibold">Create new course</p>

          {/* form for blog validation */}
          <form className="create-blog-form-height border border-grey-300  rounded-lg flex flex-col gap-4 w-full">
            <div className="w-full h-full overflow-y-auto">
              <div className="w-full flex flex-col gap-6 px-6 py-8 ">
                {/* Course Title*/}
                <div className="flex flex-col gap-3">
                  <label className="form-label" htmlFor="title">
                    Course Title{' '}
                    <span className="content-date text-[14px]">(required)</span>
                  </label>
                  <TextArea
                    label="Course Title"
                    height="30px"
                    placeholder=""
                    maxWords={50}
                    value={courseData.title}
                    onChange={(value) =>
                      setCourseData({ ...courseData, title: value })
                    }
                  />
                  {errors.title && (
                    <p className="mt-[-8px] text-redTheme paragraph-small-normal">
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Course description */}
                <div className="flex flex-col gap-3">
                  <label className="form-label" htmlFor="title">
                    Description{' '}
                    <span className="content-date text-[14px]">(required)</span>
                  </label>
                  <TextArea
                    label="Course Description"
                    height="60px"
                    value={courseData.description}
                    placeholder=""
                    maxWords={50}
                    onChange={(value) =>
                      setCourseData({ ...courseData, description: value })
                    }
                  />
                  {errors.description && (
                    <p className="mt-[-8px] text-redTheme paragraph-small-normal">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Course Level */}
                <div className="flex flex-col gap-3">
                  <label className="form-label">
                    Course Level{' '}
                    <span className="content-date text-[14px]">(required)</span>
                  </label>
                  <SingleSelectDropdown
                    choices={['beginner', 'intermediate', 'advanced']} 
                    selectedChoiceId={courseData.level}
                    setSelectedChoiceId={(selected) => setCourseData({ ...courseData, level: selected })}
                  />
                  {errors.level && (
                    <p className="mt-[-8px] text-redTheme paragraph-small-normal">
                      {errors.level}
                    </p>
                  )}
                </div>

                {/* Course Duration */}
                <div className="flex flex-col gap-3">
                  <label className="form-label">
                    Duration{' '}
                    <span className="content-date text-[14px]">(required)</span>
                  </label>
                  <TextArea
                    height="48px"
                    rows={1}
                    placeholder="e.g. 2 hours"
                    maxWords={10}
                    value={courseData.duration}
                    onChange={(value) => setCourseData({ ...courseData, duration: value })}
                  />
                  {errors.duration && (
                    <p className="mt-[-8px] text-redTheme paragraph-small-normal">
                      {errors.duration}
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
                    onFileSelect={(file) =>{
                      setCourseData({ ...courseData, coverImage: file.data});
                      setCoverImageName(file.name); }
                    }
                  />
                  {errors.coverImage && (
                    <p className="mt-[-8px] text-redTheme paragraph-small-normal">
                      {errors.coverImage}
                    </p>
                  )}
                </div>

                {/* Course Content */}
                <div className="flex flex-col gap-3">
                  <label className="form-label" htmlFor="title">
                    Content{' '}
                    <span className="content-date text-[14px]">(required)</span>
                  </label>

                  <DraftEditor
                    editorState={editorState}
                    setEditorState={setEditorState}
                  />

                  {errors.content && (
                    <p className="mt-[-8px] text-redTheme paragraph-small-normal">
                      {errors.content}
                    </p>
                  )}
                </div>

                {/* Publish As Selector */}
                <div className="flex flex-col gap-3">
                  <label className="form-label" htmlFor="publisher">
                    Publish As
                    <span className="content-date text-[14px]"> (required)</span>
                  </label>
                  <SingleSelectDropdown
                    choices={publishAsChoices} 
                    selectedChoiceId={selectedPublisherName}
                    setSelectedChoiceId={(selectedName) => { 
                      setSelectedPublisherName(selectedName);
                      const org = organisations.find(o => o.firstName === selectedName || o.id === selectedName);
                      setCourseData({ ...courseData, organisationId: org ? org.id : '' });
                    }}
                  />
                  {errors.publisher && (
                    <p className="mt-[-8px] text-redTheme paragraph-small-normal">
                      {errors.publisher}
                    </p>
                  )}
                </div>

                {/* Select tags */}
                <div className="flex flex-col gap-3">
                  <label className="form-label" htmlFor="title">
                    Select Tags
                  </label>
                  <MultiSelectDropdown
                    choices={tags}
                    selectedChoices={courseData.tags}
                    setSelectedChoices={(selected) =>
                      setCourseData({ ...courseData, tags: selected })
                    }
                  />
                  {errors.tags && (
                    <p className="mt-[-8px] text-redTheme paragraph-small-normal">
                      {errors.tags}
                    </p>
                  )}
                </div>

                {/* Select domain */}
                
                <div className="flex flex-col gap-3">
                  <label className="form-label" htmlFor="domain">
                    Select a Domain{' '}
                    <span className="content-date text-[14px]">(required)</span>
                  </label>
                  <SingleSelectDropdown
                    choices={domains} // 
                    selectedChoiceId={courseData.domain}
                    setSelectedChoiceId={(selected) => { 
                      
                      setCourseData({ ...courseData, domain: selected });}
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
                    selectedChoices={courseData.categories}
                    setSelectedChoices={(selected) => {
                      
                      setCourseData({ ...courseData, categories: selected });
                    }}
                  />
                  {errors.category && (
                    <p className="mt-[-8px] text-redTheme paragraph-small-normal">
                      {errors.categories}
                    </p>
                  )}
                </div>

                {/* Course Audio */}
                <div className="flex flex-col gap-3">
                  <label className="form-label" htmlFor="title">
                    Upload Course Audio
                  </label>
                  <FileUpload
                    id="blog-audio-upload"
                    type="Audio"
                    onFileSelect={(file) =>
                      setCourseData({ ...courseData, audioUrl: file.data })
                    }
                    maxSizeMB={10}
                    acceptedFormats={['audio/mpeg', 'audio/wav', 'audio/ogg']}
                  />
                  {courseData.audioUrl ? (
                    <AudioPlayerPreview type="cours" data={courseData.audioUrl} />
                  ) : null}
                </div>
              </div>
            </div>
            {/* buttons */}
            <div className="flex justify-end items-center gap-2 border-t border-t-grey-300 py-4 px-8">
              <CustomButton
                disabled={isLoading}
                onClick={handlePreview}
                variant="primaryOutline"
              >
                Preview
              </CustomButton>
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
        // course preview
        <div className="create-blog-form-height2 flex flex-col gap-4 h-full w-full max-w-[1200px] mx-auto px-4 mt-12">
          <div className="h-full w-full overflow-y-auto">
            <div className="w-full h-full flex flex-col gap-12 px-6 py-8 ">
              <p className="h4-medium font-semibold text-black-500">
                {' '}
                Course preview
              </p>
              <ContentPreview
                item={{
                  id: '',
                  authorId: courseData.authorId,
                  organisationId: courseData.organisationId ?? null,
                  title: courseData.title,
                  coverImage: courseData.coverImage,
                  description: courseData.description,
                  status: 'DRAFT',
                  createdAt: new Date().toISOString(),
                  publishedAt: courseData.publishedAt ?? '',
                  domain: courseData.domain,
                  contentType: 'cours',
                  tags: courseData.tags,
                  content: courseData.content,
                  readingTime: courseData.readingTime,
                  audioUrl: courseData.audioUrl,
                  categories: courseData.categories,
                  level: courseData.level,
                  duration: courseData.duration
                }}
                contentType="cours"
              />
            </div>
          </div>

          {/* buttons */}
          <div className="flex justify-end items-center gap-2 border-t border-t-grey-300 py-4 px-8">
            <CustomButton
              disabled={isLoading}
              onClick={() => setPreview(false)}
              // variant="primaryOutline"
              className="text-primaryPurple-500 bg-white border border-primaryPurple-500 hover:bg-[#e0e0e580]"
              style={{ border: '1px solid var(--primaryPurple-500)' }}
            >
              Edit
            </CustomButton>
            <Button
              disabled={isLoading}
              onClick={handleSubmit}
              variant="default"
            >
              {isLoading && <Loader />}
              Create
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateCourseComponent;
