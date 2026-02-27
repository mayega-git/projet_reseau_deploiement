/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import FileUpload from '../ui/FileUpload';

import TextArea from '../ui/textarea';
import CustomButton from '../ui/customButton';
import MultiSelectDropdown from '../ui/MultiSelectDropdown';
import AudioPlayerPreview from '../AudioPlayer/AudioPlayerPreview';
import { CreateBlogInterface } from '@/types/blog';
import { calculateReadingTime } from '@/helper/calculateReadingTime';
import BlogContent from './BlogContent';
import BlogPreview from './BlogPreview';
import { TagInterface } from '@/types/tag';
import { fetchAllTags as serverFetchTags, fetchAllCategories as serverFetchCategories, createBlog as serverCreateBlog } from '@/actions/education';
import { CategoryInterface } from '@/types/category';
import SingleSelectDropdown from '../ui/SingleComponentDropdown';
import { useAuth } from '@/context/AuthContext';
import {
  convertFromRaw,
  convertToRaw,
  DraftHandleValue,
  Editor,
  EditorState,
  RawDraftContentState,
  RichUtils,
} from 'draft-js';
import { GlobalNotifier } from '../ui/GlobalNotifier';
import Loader from '../Loader/Loader';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

// Dynamic import with SSR disabled to prevent hydration mismatch
// Draft.js generates random IDs that differ between server and client
const DraftEditor = dynamic(() => import('../Editor/DraftEditor'), {
  ssr: false,
  loading: () => <div className="editor-wrapper" style={{ minHeight: '200px', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>Loading editor...</div>,
});

const CreateBlogComponent = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<{
    name: string;
    size: number;
    data: string;
  } | null>(null);
  const [blogAudio, setBlogAudio] = useState<{
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
  const [blogData, setBlogData] = useState<CreateBlogInterface>({
    coverImage: '',
    authorId: '',
    title: '',
    description: '',
    content: '',
    audioUrl: '',
    readingTime: 0,
    domain: '',
    tags: [],
    categories: [], // Replace with actual category selection
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
const domainChoices = Array.from(new Set(categories.map(c => c.domain)));
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

  const [availableDomains, setAvailableDomains] = useState<string[]>([]);

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
  }, []);
  //Recuperer les domaines
  useEffect(() => {
  if (categories.length > 0) {
    // Extraire tous les domaines des catégories
    const domains = categories
      .map(cat => cat.domain) // Extraire tous les domaines
      .filter(domain => domain && domain.trim() !== '') // Supprimer les valeurs vides
      .filter((domain, index, self) => self.indexOf(domain) === index); // Supprimer les doublons
    
    setAvailableDomains(domains);
  }
}, [categories]);

  const [preview, setPreview] = useState<boolean>(false);

  // Function to Validate Form Fields
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    console.log(
      blogData,
      'blog data logged when validate form or preview is clicked'
    );

    if (!blogData.title.trim()) newErrors.title = 'Title is required';
    if (!blogData.description.trim())
      newErrors.description = 'Description is required';
    if (!blogData.content || blogData.content === '{}')
      newErrors.content = 'Content is required';
    if (!blogData.coverImage) newErrors.coverImage = 'Cover image is required';
    if (blogData.tags.length === 0)
      newErrors.tags = 'At least one tag is required';
    if (blogData.categories.length === 0)
      newErrors.categoryId = 'At least one category is required';

    if (!blogData.domain || blogData.domain.trim() === '') 
      newErrors.domain = 'Domain is required';
  

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Submit button clicked');
    e.preventDefault();

    //extract content
    const extractedContent = sendEditorContentToBackend(editorState);

    const rawText = getPlainText(editorState);
    const readingTime = calculateReadingTime(rawText);

    //set blog
    setBlogData((prev) => ({
      ...prev,
      content: extractedContent,
      readingTime: readingTime,
    }));

    //form  validation
    if (!validateForm()) return;

    // api call...
    const formData = new FormData();

    // Add non-file data (stringify the data)
    formData.append(
      'data',
      JSON.stringify({
        title: blogData.title,
        description: blogData.description,
        content: sendEditorContentToBackend(editorState),
        authorId: user?.id,
        readingTime: blogData.readingTime,
        tags: blogData.tags,
        categories: blogData.categories,
        domain: blogData.domain,
        plateformeId:'e4d3d2e9-1a2b-3c4d-5e6f-7a8b9c0d1e2f'
      })
    );
    // Step 2: Add the file data

    if (blogData.coverImage) {

         const fileName = coverImageName || 'cover.jpg';

    const mimeType = extractMimeType(fileName, blogData.coverImage);

      const coverImageFile = base64ToFile(
        blogData.coverImage,
       fileName,
        mimeType
      );

      formData.append('cover', coverImageFile);
    }

    if (blogData.audioUrl) {
      const audioFile = base64ToFile(
        blogData.audioUrl,
        'audio.mp3',
        'audio/mpeg'
      );

      formData.append('audio', audioFile);
    }

    try {
      setIsLoading(true);
      const result = await serverCreateBlog(formData);

      if (result.success) {
        GlobalNotifier('Blog created successfully', 'success');
        window.location.reload();
      } else {
        GlobalNotifier(result.error ?? 'Error creating blog', 'error');
      }
    } catch (err) {
      console.error('Error creating blog:', err);
      GlobalNotifier('An unexpected error occurred', 'error');
    } finally {
      setIsLoading(false);
    }

    // router.refresh();
  };

  //preview blog settings
  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();

    //extract content
    const extractedContent = sendEditorContentToBackend(editorState);
    const rawText = getPlainText(editorState);
    const readingTime = calculateReadingTime(rawText);

    //set blog
    setBlogData((prev) => ({
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
        <div className="mt-6 sm:mt-12 create-blog-form-height w-full max-w-4xl flex flex-col gap-6 sm:gap-8">
          <p className="h4-medium font-semibold">Create new blog</p>

          {/* form for blog validation */}
          <form className="create-blog-form-height border border-grey-300  rounded-lg flex flex-col gap-4 w-full">
            <div className="w-full h-full overflow-y-auto">
              <div className="w-full flex flex-col gap-6 px-4 sm:px-6 py-6 sm:py-8">
                {/* Blog Title*/}
                <div className="flex flex-col gap-3">
                  <label className="form-label" htmlFor="title">
                    Blog Title{' '}
                    <span className="content-date text-[14px]">(required)</span>
                  </label>
                  <TextArea
                    label="Blog Title"
                    height="30px"
                    placeholder=""
                    maxWords={50}
                    value={blogData.title}
                    onChange={(value) =>
                      setBlogData({ ...blogData, title: value })
                    }
                  />
                  {errors.title && (
                    <p className="mt-[-8px] text-redTheme paragraph-small-normal">
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Blog description */}
                <div className="flex flex-col gap-3">
                  <label className="form-label" htmlFor="title">
                    Description{' '}
                    <span className="content-date text-[14px]">(required)</span>
                  </label>
                  <TextArea
                    label="Blog Description"
                    height="60px"
                    value={blogData.description}
                    placeholder=""
                    maxWords={50}
                    onChange={(value) =>
                      setBlogData({ ...blogData, description: value })
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
                    onFileSelect={(file) =>{
                      setBlogData({ ...blogData, coverImage: file.data});
                      setCoverImageName(file.name); }
                    }
                  />
                  {errors.coverImage && (
                    <p className="mt-[-8px] text-redTheme paragraph-small-normal">
                      {errors.coverImage}
                    </p>
                  )}
                </div>

                {/* Blog Content */}
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

                {/* Select tags */}
                <div className="flex flex-col gap-3">
                  <label className="form-label" htmlFor="title">
                    Select Tags
                  </label>
                  <MultiSelectDropdown
                    choices={tags}
                    selectedChoices={blogData.tags}
                    setSelectedChoices={(selected) =>
                      setBlogData({ ...blogData, tags: selected })
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
                    choices={availableDomains} // 
                    selectedChoiceId={blogData.domain}
                    setSelectedChoiceId={(selected) => { 
                      
                      setBlogData({ ...blogData, domain: selected });}
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
                    selectedChoices={blogData.categories}
                    setSelectedChoices={(selected) => {
                      
                      setBlogData({ ...blogData, categories: selected });
                    }}
                  />
                  {errors.category && (
                    <p className="mt-[-8px] text-redTheme paragraph-small-normal">
                      {errors.categories}
                    </p>
                  )}
                </div>

                {/* Blog Audio */}
                <div className="flex flex-col gap-3">
                  <label className="form-label" htmlFor="title">
                    Upload Blog Audio
                  </label>
                  <FileUpload
                    id="blog-audio-upload"
                    type="Audio"
                    onFileSelect={(file) =>
                      setBlogData({ ...blogData, audioUrl: file.data })
                    }
                    maxSizeMB={10}
                    acceptedFormats={['audio/mpeg', 'audio/wav', 'audio/ogg']}
                  />
                  {blogData.audioUrl ? (
                    <AudioPlayerPreview type="blog" data={blogData.audioUrl} />
                  ) : null}
                </div>
              </div>
            </div>
            {/* buttons */}
            <div className="flex flex-wrap justify-end items-center gap-2 border-t border-t-grey-300 py-4 px-4 sm:px-8">
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
        // blog preview
        <div className="create-blog-form-height2 flex flex-col gap-4 h-full w-full max-w-4xl px-0 sm:px-4 mt-6 sm:mt-12">
          <div className="h-full w-full overflow-y-auto">
            <div className="w-full h-full flex flex-col gap-8 sm:gap-12 px-4 sm:px-6 py-6 sm:py-8">
              <p className="h4-medium font-semibold text-black-500">
                {' '}
                Blog preview
              </p>
              <BlogPreview blog={blogData} />
            </div>
          </div>

          {/* buttons */}
          <div className="flex flex-wrap justify-end items-center gap-2 border-t border-t-grey-300 py-4 px-4 sm:px-8">
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

export default CreateBlogComponent;
function draftToHtml(rawContent: RawDraftContentState): string {
  throw new Error('Function not implemented.');
}
