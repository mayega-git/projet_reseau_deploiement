/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useEffect, useState } from 'react';
import FileUpload from '../ui/FileUpload';
import TextArea from '../ui/textarea';
import CustomButton from '../ui/customButton';
import MultiSelectDropdown from '../ui/MultiSelectDropdown';
import AudioPlayerPreview from '../AudioPlayer/AudioPlayerPreview';
import { BlogInterface, CreateBlogInterface } from '@/types/blog';
import { calculateReadingTime } from '@/helper/calculateReadingTime';
import BlogContent from './BlogContent';
import BlogPreview from './BlogPreview';
import { TagInterface } from '@/types/tag';
import { fetchAllTags as serverFetchTags, fetchAllCategories as serverFetchCategories, updateBlog as serverUpdateBlog } from '@/actions/education';
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
import DraftEditor from '../Editor/DraftEditor';
import { GlobalNotifier } from '../ui/GlobalNotifier';
import Loader from '../Loader/Loader';
import { Button } from '../ui/button';
import { Description } from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';

interface UpdateBlogComponentProps {
  blog: BlogInterface;
}
const UpdateBlogComponent: React.FC<UpdateBlogComponentProps> = ({ blog }) => {
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
    title: blog.title,
    description: blog.description,
    content: blog.content,
    audioUrl: '',
    readingTime: blog.readingTime,
    domain: blog.domain,
    tags: blog.tags,
    categories: blog.category
  });

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
    if (!blogData.categories)
      newErrors.categoryId = 'At least one category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
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
        category: blogData.categories,
      })
    );
    // Step 2: Add the file data

    if (blogData.coverImage) {
      const coverImageFile = base64ToFile(
        blogData.coverImage,
        'cover.jpg',
        'image/jpeg'
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
      const result = await serverUpdateBlog(blog.id, formData);

      if (result.success) {
        GlobalNotifier('Blog updated successfully', 'success');
        window.location.reload();
      } else {
        GlobalNotifier(result.error ?? 'Error updating blog', 'error');
      }
    } catch (err) {
      console.error('Error updating blog:', err);
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
          <p className="h4-medium font-semibold">Update blog</p>

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
                    onFileSelect={(file) =>
                      setBlogData({ ...blogData, coverImage: file.data })
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

                {/* Select categories */}
                <div className="flex flex-col gap-3">
                  <label className="form-label" htmlFor="title">
                    Select a category
                  </label>
                  <MultiSelectDropdown
                    choices={categories}
                    selectedChoices={blogData.categories}
                    setSelectedChoices={(selected) =>
                      setBlogData({ ...blogData, categories: selected })
                    }
                  />
                  {errors.categoryId && (
                    <p className="mt-[-8px] text-redTheme paragraph-small-normal">
                      {errors.categoryId}
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

export default UpdateBlogComponent;
function draftToHtml(rawContent: RawDraftContentState): string {
  throw new Error('Function not implemented.');
}
